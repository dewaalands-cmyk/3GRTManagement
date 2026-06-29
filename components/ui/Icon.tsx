import {
  Swords, Shield, Users, Trophy, Video, Handshake, Megaphone,
  Dumbbell, Flame, Crown, Target, Radio, Medal, Ticket, Star,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Swords, Shield, Users, Trophy, Video, Handshake, Megaphone,
  Dumbbell, Flame, Crown, Target, Radio, Medal, Ticket, Star,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = MAP[name] ?? Swords;
  return <Cmp className={className} aria-hidden />;
}
