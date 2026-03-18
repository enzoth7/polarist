import { MessageCircleHeart, MessagesSquare, Sparkles, type LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AreaKey = "gastronomia" | "administracion" | "ventas" | "marketing";

type Thread = {
  name: string;
  business: string;
  businessType: string;
  question: string;
  shortcut: string;
  replies: string;
  savedTime: string;
  mood: string;
  initials: string;
};

const areas: Array<{
  value: AreaKey;
  label: string;
  subtitle: string;
  stat: string;
  icon: LucideIcon;
}> = [
  { value: "gastronomia", label: "Gastronomia", subtitle: "Pedidos, reservas y cocina", stat: "12 dudas abiertas", icon: Sparkles },
  { value: "administracion", label: "Administracion", subtitle: "Cobros, facturas y orden", stat: "9 dudas abiertas", icon: Sparkles },
  { value: "ventas", label: "Ventas", subtitle: "Seguimiento y cierres", stat: "15 dudas abiertas", icon: Sparkles },
  { value: "marketing", label: "Marketing", subtitle: "Promos y contenido simple", stat: "11 dudas abiertas", icon: Sparkles },
];

const communityThreads: Record<AreaKey, Thread[]> = {
  gastronomia: [
    {
      name: "Lucia",
      business: "Panaderia de barrio",
      businessType: "Toma pedidos por WhatsApp y mostrador",
      question: "Hola, me escriben por WhatsApp a cualquier hora para pedir tortas. Quiero responder rapido sin copiar siempre lo mismo. Alguno ya encontro un atajo simple?",
      shortcut: "Le compartieron un guion corto con tres respuestas base: precios, horarios y senas. Ahora solo cambia el sabor y ahorra casi toda la ida y vuelta.",
      replies: "7 respuestas utiles",
      savedTime: "Ahorra 3 horas por semana",
      mood: "Tema activo hace 20 min",
      initials: "LU",
    },
    {
      name: "Martin",
      business: "Restaurante familiar",
      businessType: "Recibe reservas por Instagram y llamadas",
      question: "Estoy mezclando reservas de Instagram con llamadas y se me pisan las mesas. Necesito algo que me deje todo mas claro sin volverme loco.",
      shortcut: "La comunidad le sugirio una plantilla unica para pasar cada reserva a una sola lista y un mensaje de confirmacion que se manda en menos de un minuto.",
      replies: "11 respuestas utiles",
      savedTime: "Ahorra 5 horas por semana",
      mood: "2 personas probando este atajo",
      initials: "MA",
    },
    {
      name: "Sofia",
      business: "Cafe con delivery",
      businessType: "Publica promos todos los dias",
      question: "Pierdo mucho rato armando la promo del dia para historias. Necesito algo rapido que no quede feo y me saque el bloqueo.",
      shortcut: "Le pasaron un formato fijo para promo diaria: foto, precio, llamado a la accion y horario. Solo cambia producto y sale en 10 minutos.",
      replies: "5 respuestas utiles",
      savedTime: "Ahorra 4 horas por semana",
      mood: "Se movio hoy temprano",
      initials: "SO",
    },
  ],
  administracion: [
    {
      name: "Diego",
      business: "Ferreteria",
      businessType: "Maneja stock y pedidos a proveedores",
      question: "Tengo los pedidos a proveedores en el mail, las notas en papel y despues no se que falta pagar. Quiero un orden simple para no olvidarme de nada.",
      shortcut: "Le recomendaron pasar todo a una sola tabla con tres columnas: pedido, fecha y pagado. Tambien un recordatorio semanal para revisar lo pendiente.",
      replies: "8 respuestas utiles",
      savedTime: "Ahorra 2 horas por semana",
      mood: "Tema abierto hoy",
      initials: "DI",
    },
    {
      name: "Paula",
      business: "Estudio contable chico",
      businessType: "Hace seguimiento de clientes por mail",
      question: "Todos me mandan comprobantes por canales distintos. Estoy cansada de perseguir archivos y renombrarlos. Hay algun atajo facil?",
      shortcut: "Otro miembro le compartio un mensaje tipo para pedir siempre el archivo con el mismo formato y una carpeta semanal ya preparada.",
      replies: "10 respuestas utiles",
      savedTime: "Ahorra 4 horas por semana",
      mood: "3 personas lo guardaron",
      initials: "PA",
    },
    {
      name: "Nestor",
      business: "Corralon",
      businessType: "Arma presupuestos manuales",
      question: "Cada presupuesto me lleva demasiado porque escribo todo desde cero. Quiero tardar menos y que se vea prolijo.",
      shortcut: "Le dejaron una base de presupuesto que solo cambia cliente, materiales y total. Tambien un texto para seguimiento al dia siguiente.",
      replies: "6 respuestas utiles",
      savedTime: "Ahorra 6 horas por semana",
      mood: "Ultima respuesta hace 1 hora",
      initials: "NE",
    },
  ],
  ventas: [
    {
      name: "Carla",
      business: "Local de ropa",
      businessType: "Vende por mostrador e Instagram",
      question: "Muchas clientas preguntan precio, desaparecen y no vuelven. Quiero hacer seguimiento sin sonar pesada.",
      shortcut: "Le sugirieron un mensaje corto de seguimiento para 24 horas despues, con foto, talle y una sola pregunta para retomar la charla.",
      replies: "13 respuestas utiles",
      savedTime: "Ahorra 3 horas por semana",
      mood: "Tema con varias pruebas reales",
      initials: "CA",
    },
    {
      name: "Javier",
      business: "Tienda de celulares",
      businessType: "Pasa presupuestos por WhatsApp",
      question: "Mando presupuestos todos los dias y despues no se a quien volver a escribirle. Necesito un sistema facil para no perder ventas.",
      shortcut: "Un miembro le compartio una lista de seguimiento con tres estados: enviado, por responder y cerrado. Con eso ya sabe a quien llamar cada tarde.",
      replies: "9 respuestas utiles",
      savedTime: "Ahorra 4 horas por semana",
      mood: "Tema activo hace 45 min",
      initials: "JA",
    },
    {
      name: "Rocio",
      business: "Muebleria",
      businessType: "Atiende consultas largas",
      question: "Me escriben mucho para pedir medidas, colores y entrega. Quiero contestar bien pero sin pasar media tarde pegada al telefono.",
      shortcut: "Le dejaron una respuesta base por modelo con medidas, colores, envio y tiempo de entrega. Solo cambia el producto y sigue la conversacion.",
      replies: "7 respuestas utiles",
      savedTime: "Ahorra 5 horas por semana",
      mood: "Guardado por 6 personas",
      initials: "RO",
    },
  ],
  marketing: [
    {
      name: "Andrea",
      business: "Peluqueria",
      businessType: "Publica promos y recordatorios",
      question: "No me salen ideas para publicar. Cuando por fin subo algo, ya perdi media hora. Quiero una rutina sencilla para no pensar tanto.",
      shortcut: "Le pasaron una grilla semanal con cuatro tipos de posteos: promo, antes y despues, testimonio y agenda disponible.",
      replies: "12 respuestas utiles",
      savedTime: "Ahorra 3 horas por semana",
      mood: "Tema fuerte esta semana",
      initials: "AN",
    },
    {
      name: "Emilio",
      business: "Gimnasio barrial",
      businessType: "Hace flyers y textos solo",
      question: "Cada mes hago los flyers de cero y termino copiando cosas de otros. Necesito algo rapido y claro para mis promos.",
      shortcut: "La comunidad le compartio una estructura fija: titulo, oferta, fecha, llamada a la accion y una foto del local. Sale mucho mas rapido y mas parejo.",
      replies: "8 respuestas utiles",
      savedTime: "Ahorra 4 horas por semana",
      mood: "Ultimo aporte hace 30 min",
      initials: "EM",
    },
    {
      name: "Valeria",
      business: "Libreria",
      businessType: "Comunica novedades por estados",
      question: "Tengo novedades todo el tiempo y no se como contarlas sin que queden aburridas. Quiero algo simple y constante.",
      shortcut: "Le sugirieron un formato de tres pasos: que llego, para quien sirve y como pedirlo. Ahora resuelve cada estado en pocos minutos.",
      replies: "6 respuestas utiles",
      savedTime: "Ahorra 2 horas por semana",
      mood: "Se reabrio hoy",
      initials: "VA",
    },
  ],
};

const Community = () => {
  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-4 md:px-8 md:pb-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="rounded-[2rem] border-border/60 shadow-soft">
            <CardHeader className="pb-4">
              <Badge variant="secondary" className="w-fit rounded-full">Comunidad sin humo</Badge>
              <CardTitle className="text-3xl font-black tracking-tight">Dudas normales. Respuestas utiles.</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-7">
                Este foro esta pensado para gente ocupada. Nadie entra aca a lucirse: entra a sacar una traba del medio y volver al negocio.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-muted/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Lo que mas se busca</p>
                <p className="mt-2 text-sm font-semibold text-foreground">Respuestas rapidas para WhatsApp, reservas, presupuestos y contenido.</p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tono de la comunidad</p>
                <p className="mt-2 text-sm font-semibold text-foreground">Sin palabras raras. Sin hacerse el experto. Todo baja a tareas del dia a dia.</p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Meta comun</p>
                <p className="mt-2 text-sm font-semibold text-foreground">Ahorrar horas sin sentir que tienes que hacer un curso entero.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border/60 shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black">Lo que esta pasando hoy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">35 conversaciones abiertas</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">La mayoria pregunta por mensajes repetidos, orden interno y seguimiento de clientes.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">Atajos mas compartidos</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Plantillas de respuesta, listas simples y rutinas para publicar sin pensar tanto.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="gastronomia" className="w-full">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-[1.5rem] bg-muted/60 p-2">
            {areas.map((area) => (
              <TabsTrigger
                key={area.value}
                value={area.value}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold data-[state=active]:shadow-none"
              >
                {area.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {areas.map((area) => (
            <TabsContent key={area.value} value={area.value} className="mt-4 space-y-4">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <Card className="rounded-[2rem] border-border/60 shadow-soft">
                  <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{area.label}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{area.subtitle}</p>
                    </div>
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-semibold">
                      {area.stat}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-border/60 shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-foreground">
                      <MessagesSquare className="h-4 w-4" />
                      <p className="text-sm font-semibold">Lo mas pedido</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Gente buscando un primer paso simple para dejar de repetir tareas y ganar aire.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                {communityThreads[area.value].map((thread) => (
                  <Card key={`${area.value}-${thread.name}`} className="rounded-[2rem] border-border/60 shadow-soft">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border border-border/60">
                          <AvatarFallback className="bg-muted text-sm font-bold text-foreground">{thread.initials}</AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-lg font-bold">{thread.name}</CardTitle>
                            <Badge variant="secondary" className="rounded-full">{thread.business}</Badge>
                          </div>
                          <CardDescription className="mt-1 text-sm">{thread.businessType}</CardDescription>
                        </div>

                        <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] font-semibold">
                          {thread.savedTime}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="rounded-2xl bg-muted/50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Duda real</p>
                        <p className="mt-2 text-sm leading-7 text-foreground">{thread.question}</p>
                      </div>

                      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <MessageCircleHeart className="h-4 w-4 text-primary" />
                          Atajo que ya le sirvio a otro negocio
                        </div>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{thread.shortcut}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{thread.replies}</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span>{thread.mood}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
