export const getListingRating = (accommodation) => {
  const title = accommodation?.title
    ?.toLowerCase()
    .trim();

  const ratings = {
    "camps bay ocean view": 4.92,
    "clifton sunset villa": 4.87,
    "sea point modern apartment": 4.76,
    "stellenbosch winelands cottage": 4.95,
    "knysna lagoon house": 4.84,
    "umhlanga beachfront apartment": 4.89,
  };

  return ratings[title] || 4.8;
};