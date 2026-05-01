'use client';

import React from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
	children: React.ReactNode;
	onUpload: (file: File) => Promise<{ success: boolean }>;
	aspect?: number; // default 1 (square)
	maxSizeMB?: number; // default 20
	acceptedTypes?: string[]; // default jpg, jpeg, png, webp
}

export function AvatarUploader({
	children,
	onUpload,
	aspect = 1,
	maxSizeMB = 20,
	acceptedTypes = ['jpeg', 'jpg', 'png', 'webp'],
}: Props) {
	const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = React.useState<number>(1);

	const [isPending, setIsPending] = React.useState<boolean>(false);
	const [photo, setPhoto] = React.useState<{ url: string; file: File | null }>({
		url: '',
		file: null,
	});
	const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
		null,
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const img_ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
		const validExt = acceptedTypes.includes(img_ext);

		if (!validExt) {
			console.error('Selected file is not a supported image type');
			return;
		}

		if (parseFloat(String(file.size)) / (1024 * 1024) >= maxSizeMB) {
			console.error('Selected image is too large');
			return;
		}
		
		setPhoto({ url: URL.createObjectURL(file), file });
	};

	const handleCropComplete = (_: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels);
	};

	const [open, onOpenChange] = React.useState<boolean>(false);

	const handleUpdate = async () => {
		if (photo?.file && croppedAreaPixels) {
			setIsPending(true);
			try {
				const croppedImg = await getCroppedImg(photo?.url, croppedAreaPixels);
				if (!croppedImg || !croppedImg.file) {
					throw new Error('Failed to crop image');
				}

				const file = new File(
					[croppedImg.file],
					photo.file?.name ?? 'cropped.jpeg',
					{
						type: photo.file?.type ?? 'image/jpeg',
					},
				);

				await onUpload(file);
				setPhoto({ url: '', file: null });
				onOpenChange(false);
			} catch (error) {
				console.error('Failed to update image:', error);
			} finally {
				setIsPending(false);
			}
		} else {
			console.error('No image selected for upload');
		}
	};

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			desktopOnly
			drawerProps={{
				dismissible: photo?.file ? false : true,
			}}
		>
			<ModalTrigger asChild>{children}</ModalTrigger>
			<ModalContent className="h-max md:max-w-md border border-white/10">
				<ModalHeader>
					<ModalTitle>Ajustar imagen</ModalTitle>
				</ModalHeader>
				<ModalBody className="space-y-4" style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}>
					<div className="flex w-full flex-col space-y-3">
						<Button
							type="button"
							className="w-fit mx-auto px-8 rounded-full bg-[#F6F6F6] text-[#010101] font-bold hover:bg-white"
							onClick={() => document.getElementById('avatar-upload-input')?.click()}
							disabled={isPending}
							style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
						>
							Seleccionar archivo
						</Button>
						<div className="text-center text-sm text-white/70 break-all px-2">
							{photo?.file ? photo.file.name : "Ningún archivo seleccionado"}
						</div>
						<Input
							id="avatar-upload-input"
							disabled={isPending}
							onChange={handleFileChange}
							type="file"
							accept="image/*"
							className="hidden"
						/>
					</div>

					{photo?.file && (
						<div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-900">
							<Cropper
								image={photo.url}
								crop={crop}
								zoom={zoom}
								aspect={aspect}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={handleCropComplete}
								classes={{
									containerClassName: isPending
										? 'opacity-80 pointer-events-none'
										: '',
								}}
							/>
						</div>
					)}
				</ModalBody>

				<ModalFooter className="grid w-full grid-cols-2 gap-3" style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}>
					<Button
						className="w-full rounded-full bg-white/5 text-white hover:bg-white/10 font-bold border-none"
						variant="outline"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
						style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
					>
						Cancelar
					</Button>

					<Button
						className="w-full rounded-full bg-[#CAFE5B] text-[#010101] hover:bg-[#CAFE5B]/90 font-bold"
						type="button"
						onClick={handleUpdate}
						disabled={isPending}
						style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
					>
						{isPending ? 'Subiendo...' : 'Actualizar'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', (error) => reject(error));
		image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
		image.src = url;
	});

function getRadianAngle(degreeValue: number): number {
	return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(
	width: number,
	height: number,
	rotation: number,
): { width: number; height: number } {
	const rotRad = getRadianAngle(rotation);

	return {
		width:
			Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
		height:
			Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
	};
}

type Flip = {
	horizontal: boolean;
	vertical: boolean;
};

async function getCroppedImg(
	imageSrc: string,
	pixelCrop: Area,
	rotation = 0,
	flip: Flip = { horizontal: false, vertical: false },
): Promise<{ url: string; file: Blob | null } | null> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('Failed to create 2D context');
	}

	const rotRad = getRadianAngle(rotation);

	// calculate bounding box of the rotated image
	const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
		image.width,
		image.height,
		rotation,
	);

	// set canvas size to match the bounding box
	canvas.width = bBoxWidth;
	canvas.height = bBoxHeight;

	// translate canvas context to a central location to allow rotating and flipping around the center
	ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
	ctx.rotate(rotRad);
	ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
	ctx.translate(-image.width / 2, -image.height / 2);

	// draw rotated image
	ctx.drawImage(image, 0, 0);

	// extract cropped image
	const data = ctx.getImageData(
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
	);

	// set canvas width to final desired crop size - this clears context
	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	// paste cropped image
	ctx.putImageData(data, 0, 0);

	// return blob + object URL
	return new Promise((resolve, reject) => {
		canvas.toBlob((file) => {
			if (!file) {
				reject(new Error('Failed to generate cropped image blob'));
				return;
			}
			resolve({
				url: URL.createObjectURL(file),
				file,
			});
		}, 'image/jpeg');
	});
}
