// Standard Indian hotel occupancy/child-policy pricing rules.
//
// - Every room's listed price already covers 2 adults (base occupancy).
// - A 3rd (or further) adult in a room needs an Extra Bed -> extra_bed_charge applies.
// - A child aged 0-5 stays free (no charge, no bed).
// - A child aged 6-12 is charged as CNB (Child No Bed) -> cnb_charge applies.
// - A child above 12 is treated as a full adult -> extra_bed_charge applies instead of CNB.
//
// extra_bed_charge / cnb_charge are set per room type by the hotel admin
// (admin/hotels/rooms.php) since they can vary by room. Both are per night.

export interface RoomGuestSelection {
  adults: number;
  children: number;
  childAges?: number[];
}

export const STANDARD_BASE_OCCUPANCY_ADULTS = 2;

export type ChildAgeCategory = 'free' | 'cnb' | 'adult';

export function classifyChildAge(age: number): ChildAgeCategory {
  if (age <= 5) return 'free';
  if (age <= 12) return 'cnb';
  return 'adult';
}

export interface RoomExtraCharge {
  extraAdultCount: number; // adults beyond base occupancy, incl. children treated as adult (12+)
  cnbCount: number; // children aged 6-12
  amount: number; // total extra charge for this one physical room, per night
}

// Extra charge (per night) for ONE physical/requested room, given its guest selection
// and that room type's admin-configured charges.
export function extraChargeForRoom(
  room: RoomGuestSelection,
  extraBedCharge: number,
  cnbCharge: number
): RoomExtraCharge {
  let extraAdultCount = Math.max(0, (room.adults || 0) - STANDARD_BASE_OCCUPANCY_ADULTS);
  let cnbCount = 0;

  const ages = room.childAges || [];
  for (const age of ages) {
    const category = classifyChildAge(age);
    if (category === 'cnb') cnbCount += 1;
    else if (category === 'adult') extraAdultCount += 1;
    // 'free' -> no charge
  }

  const amount = extraAdultCount * (extraBedCharge || 0) + cnbCount * (cnbCharge || 0);
  return { extraAdultCount, cnbCount, amount };
}

// Sum of extra charges (per night) across all requested physical rooms for a
// given room type's extra_bed_charge / cnb_charge.
export function totalExtraChargePerNight(
  roomsList: RoomGuestSelection[],
  extraBedCharge: number,
  cnbCharge: number
): number {
  return roomsList.reduce(
    (sum, r) => sum + extraChargeForRoom(r, extraBedCharge, cnbCharge).amount,
    0
  );
}

// Parses the `rooms` URL query param used across the hotel search/list/details/
// checkout pages. Accepts the JSON array format ({adults,children,childAges}[]);
// falls back to a sane default if missing/invalid.
export function parseRoomsParam(raw: string | null | undefined): RoomGuestSelection[] {
  if (!raw) return [{ adults: 2, children: 0, childAges: [] }];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((r) => ({
        adults: Number(r.adults) || 1,
        children: Number(r.children) || 0,
        childAges: Array.isArray(r.childAges) ? r.childAges.map((a: unknown) => Number(a) || 0) : [],
      }));
    }
  } catch {
    // Not JSON (e.g. an old bookmarked link using the legacy flat room count) - ignore.
  }
  return [{ adults: 2, children: 0, childAges: [] }];
}
