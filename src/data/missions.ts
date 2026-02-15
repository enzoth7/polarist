export const MISSIONS = [
    { title: "Sube una foto de tu producto estrella", description: "Muestra lo mejor que tienes. Una buena foto vale más que mil palabras.", category: "foto" },
    { title: "Cuenta tu historia", description: "¿Por qué empezaste tu negocio? A la gente le encanta conocer la historia detrás.", category: "historia" },
    { title: "Crea una oferta especial", description: "Un descuento o promoción para esta semana. ¡Haz que la gente se emocione!", category: "promo" },
    { title: "Comparte un tip de tu industria", description: "Comparte algo que tus clientes no sepan. ¡Conviértete en experto!", category: "idea" },
    { title: "Muestra tu espacio de trabajo", description: "Lleva a tus seguidores detrás de escenas. ¡La autenticidad conecta!", category: "foto" },
];

export const getMissionForDate = (date: Date) => {
    const dayIndex = date.getDay(); // 0-6
    return MISSIONS[dayIndex % MISSIONS.length];
};
