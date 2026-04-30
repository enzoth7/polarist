import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

type CommunityRegistrationRow = {
  id: string;
  email: string;
  name: string | null;
  event_id: string | null;
  event_date: string | null;
  user_id: string | null;
  created_at: string;
};

type CommunityEventRow = {
  id: string;
  title: string;
  event_date: string;
  image_url: string | null;
};

export type UserEvent = {
  registrationId: string;
  eventId: string | null;
  email: string;
  name: string | null;
  registeredAt: string;
  title: string | null;
  eventDate: string | null;
  imageUrl: string | null;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeEmail = (email?: string) => email?.trim().toLowerCase() ?? "";

const fetchUserEvents = async (email: string, userId?: string): Promise<UserEvent[]> => {
  let query = supabase
    .from("community_registrations")
    .select("id, email, name, event_id, event_date, created_at, user_id");

  if (userId && email) {
    query = query.or(`email.eq."${email}",user_id.eq."${userId}"`);
  } else if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.eq("email", email);
  }

  const { data, error } = await query
    .order("event_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const registrations = (data ?? []) as CommunityRegistrationRow[];

  if (registrations.length === 0) {
    return [];
  }

  const eventIds = Array.from(
    new Set(
      registrations
        .map((registration) => registration.event_id)
        .filter((eventId): eventId is string => Boolean(eventId && UUID_PATTERN.test(eventId))),
    ),
  );

  const eventsById = new Map<string, CommunityEventRow>();

  if (eventIds.length > 0) {
    const { data: eventData, error: eventError } = await supabase
      .from("community_events")
      .select("id, title, event_date, image_url")
      .in("id", eventIds);

    if (eventError) {
      throw eventError;
    }

    for (const event of (eventData ?? []) as CommunityEventRow[]) {
      eventsById.set(event.id, event);
    }
  }

  return registrations.map((registration) => {
    const event = registration.event_id ? eventsById.get(registration.event_id) : undefined;

    return {
      registrationId: registration.id,
      eventId: registration.event_id,
      email: registration.email,
      name: registration.name,
      registeredAt: registration.created_at,
      title: event?.title ?? null,
      eventDate: event?.event_date ?? registration.event_date,
      imageUrl: event?.image_url ?? null,
    };
  });
};

export function useUserEvents(email?: string, userId?: string) {
  const normalizedEmail = normalizeEmail(email);

  const query = useQuery({
    queryKey: ["user-events", normalizedEmail || null, userId || null],
    queryFn: () => fetchUserEvents(normalizedEmail, userId),
    enabled: Boolean(normalizedEmail || userId),
    staleTime: 60_000,
  });

  return {
    events: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
