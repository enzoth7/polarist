from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
import base64

def generate_vapid_keys():
    # Generate SECP256R1 private key
    private_key = ec.generate_private_key(ec.SECP256R1())

    # Public key in X9.62 uncompressed format
    public_key_bytes = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint
    )
    # VAPID requires base64url encoding without padding
    public_key_b64 = base64.urlsafe_b64encode(public_key_bytes).decode("utf-8").rstrip("=")

    # Private key (raw D value, 32 bytes)
    private_value = private_key.private_numbers().private_value
    private_key_bytes = private_value.to_bytes(32, byteorder='big')
    private_key_b64 = base64.urlsafe_b64encode(private_key_bytes).decode("utf-8").rstrip("=")

    print(f"VITE_VAPID_PUBLIC_KEY={public_key_b64}")
    print(f"VAPID_PRIVATE_KEY={private_key_b64}")

if __name__ == "__main__":
    generate_vapid_keys()
