export interface MissionDefinition {
  titleKey: string;
  descriptionKey: string;
  category: string;
}

export const MISSIONS: MissionDefinition[] = [
  {
    titleKey: "missions.items.1.title",
    descriptionKey: "missions.items.1.description",
    category: "foto",
  },
  {
    titleKey: "missions.items.2.title",
    descriptionKey: "missions.items.2.description",
    category: "historia",
  },
  {
    titleKey: "missions.items.3.title",
    descriptionKey: "missions.items.3.description",
    category: "promo",
  },
  {
    titleKey: "missions.items.4.title",
    descriptionKey: "missions.items.4.description",
    category: "idea",
  },
  {
    titleKey: "missions.items.5.title",
    descriptionKey: "missions.items.5.description",
    category: "foto",
  },
];

export const getMissionForDate = (date: Date) => {
  const dayIndex = date.getDay();
  return MISSIONS[dayIndex % MISSIONS.length];
};
