import type { Rarity } from '../types';

export type AnimalGroup =
  | 'pets'
  | 'farm'
  | 'ocean'
  | 'birds'
  | 'wild'
  | 'exotic'
  | 'reptiles'
  | 'amphibians'
  | 'baby';

export interface AnimalEntry {
  id: string;             // URL-safe slug used as AnimalCategory
  name: string;           // Human-readable name
  emoji: string;          // Representative emoji
  group: AnimalGroup;
  speciesRarity: Rarity;  // Controls how often this species appears
  tags: string[];         // For search, recommendations & filtering
  keyword: string;        // LoremFlickr fallback keyword
  wikiArticles: string[]; // Wikipedia article slugs for Tier-1 images
  facts: string[];        // Species-specific rotating facts (3–5 per animal)
}

export const ANIMAL_REGISTRY: AnimalEntry[] = [
  // ── PETS ────────────────────────────────────────────────────────────────
  {
    id: 'dogs', name: 'Dogs', emoji: '🐶', group: 'pets', speciesRarity: 'common',
    tags: ['fluffy', 'loyal', 'playful', 'cute', 'friendly'],
    keyword: 'dog',
    wikiArticles: [
      'Labrador_Retriever', 'Golden_Retriever', 'Pembroke_Welsh_Corgi',
      'Pomeranian_(dog)', 'Shiba_Inu', 'Bernese_Mountain_Dog',
      'Samoyed_(dog)', 'Border_Collie', 'Siberian_Husky', 'Australian_Shepherd',
      'French_Bulldog', 'Beagle', 'Dachshund',
    ],
    facts: [
      'Dogs have a sense of smell 40× stronger than humans!',
      'A dog\'s nose print is as unique as a human fingerprint.',
      'Puppies are born blind, deaf, and toothless.',
      'Dogs can detect human emotions through scent alone.',
      'The Basenji is the only dog that can\'t bark — it yodels instead!',
    ],
  },
  {
    id: 'cats', name: 'Cats', emoji: '🐱', group: 'pets', speciesRarity: 'common',
    tags: ['fluffy', 'independent', 'cute', 'elegant', 'mysterious'],
    keyword: 'cat',
    wikiArticles: [
      'Persian_cat', 'Maine_Coon', 'Ragdoll_cat', 'Scottish_Fold',
      'Norwegian_Forest_cat', 'Bengal_cat', 'Siamese_cat',
      'Russian_Blue', 'Turkish_Angora', 'Birman',
    ],
    facts: [
      'Cats have 32 muscles in each ear!',
      'A cat\'s purr vibrates at frequencies that promote bone healing.',
      'Cats can make over 100 different vocal sounds.',
      'Cats sleep 12–16 hours per day on average.',
      'A group of cats is called a clowder.',
    ],
  },
  {
    id: 'rabbits', name: 'Rabbits', emoji: '🐰', group: 'pets', speciesRarity: 'common',
    tags: ['fluffy', 'cute', 'gentle', 'soft', 'adorable'],
    keyword: 'rabbit',
    wikiArticles: [
      'Domestic_rabbit', 'Holland_Lop', 'Flemish_Giant_rabbit',
      'Angora_rabbit', 'Netherland_Dwarf_rabbit', 'Rex_rabbit', 'Lionhead_rabbit',
    ],
    facts: [
      'A group of rabbits is called a fluffle!',
      'Rabbits purr when happy, just like cats.',
      'Baby rabbits are called kittens.',
      'Rabbits can jump up to 3 feet high and 9 feet in a single leap.',
      'Rabbits\' teeth never stop growing throughout their lives.',
    ],
  },
  {
    id: 'hamsters', name: 'Hamsters', emoji: '🐹', group: 'pets', speciesRarity: 'common',
    tags: ['tiny', 'cute', 'funny', 'soft', 'round'],
    keyword: 'hamster',
    wikiArticles: [
      'Syrian_hamster', 'Roborovski_hamster', 'Dwarf_hamster',
      'Winter_white_dwarf_hamster', 'Chinese_hamster',
    ],
    facts: [
      'Hamsters can run up to 5 miles in a single night!',
      'Hamster cheek pouches stretch all the way to their hips.',
      'A hamster\'s teeth never stop growing — they need to chew to keep them short.',
      'Hamsters are colorblind but have excellent hearing.',
      'Wild hamsters hibernate during winter months.',
    ],
  },
  {
    id: 'hedgehogs', name: 'Hedgehogs', emoji: '🦔', group: 'pets', speciesRarity: 'uncommon',
    tags: ['spiky', 'cute', 'tiny', 'unique', 'adorable'],
    keyword: 'hedgehog',
    wikiArticles: ['European_hedgehog', 'African_pygmy_hedgehog', 'Hedgehog'],
    facts: [
      'A baby hedgehog is called a hoglet!',
      'Hedgehogs have between 5,000 and 7,000 spines.',
      'Hedgehogs anoint themselves with new smells by licking and spitting foam on their spines.',
      'A group of hedgehogs is called an array.',
      'Hedgehogs are immune to many snake and scorpion venoms.',
    ],
  },
  {
    id: 'ferrets', name: 'Ferrets', emoji: '🐾', group: 'pets', speciesRarity: 'uncommon',
    tags: ['playful', 'mischievous', 'cute', 'funny', 'agile'],
    keyword: 'ferret',
    wikiArticles: ['Ferret'],
    facts: [
      'Ferrets do a happy dance called the "weasel war dance"!',
      'A group of ferrets is called a business.',
      'Ferrets sleep up to 18 hours per day.',
      'Ferrets have been domesticated for over 2,500 years.',
      'Baby ferrets are called kits.',
    ],
  },
  {
    id: 'guinea-pigs', name: 'Guinea Pigs', emoji: '🐾', group: 'pets', speciesRarity: 'common',
    tags: ['cute', 'tiny', 'gentle', 'soft', 'social'],
    keyword: 'guineapig',
    wikiArticles: ['Guinea_pig', 'Abyssinian_guinea_pig'],
    facts: [
      'Guinea pigs "popcorn" — jump and twist in the air — when they\'re happy!',
      'Guinea pigs are social animals and can develop depression if kept alone.',
      'Baby guinea pigs are born fully furred and can run within hours.',
      'Guinea pigs make over 11 distinct vocalizations.',
      'A group of guinea pigs is called a herd.',
    ],
  },

  // ── FARM ────────────────────────────────────────────────────────────────
  {
    id: 'horses', name: 'Horses', emoji: '🐴', group: 'farm', speciesRarity: 'uncommon',
    tags: ['majestic', 'large', 'beautiful', 'graceful', 'powerful'],
    keyword: 'horse',
    wikiArticles: [
      'Horse', 'Thoroughbred', 'Andalusian_horse',
      'Shetland_pony', 'Friesian_horse', 'Arabian_horse',
    ],
    facts: [
      'Horses can sleep both lying down and standing up!',
      'A horse\'s eye is the largest of any land mammal.',
      'Horses communicate through ear positions — there are 17 distinct ear signals.',
      'A horse can run up to 55 mph at full gallop.',
      'Horses have nearly 360-degree panoramic vision.',
    ],
  },
  {
    id: 'cows', name: 'Cows', emoji: '🐄', group: 'farm', speciesRarity: 'uncommon',
    tags: ['wholesome', 'gentle', 'large', 'cute', 'peaceful'],
    keyword: 'cow',
    wikiArticles: [
      'Dairy_cattle', 'Highland_cattle', 'Hereford_cattle',
      'Jersey_cattle', 'Belted_Galloway',
    ],
    facts: [
      'Cows have best friends and get anxious when separated!',
      'Cows can recognize up to 100 individual faces — human or bovine.',
      'Cows moo in regional accents based on where they grew up.',
      'A single cow produces about 6 gallons of milk per day.',
      'Cows have a nearly 360-degree field of view.',
    ],
  },
  {
    id: 'pigs', name: 'Pigs', emoji: '🐷', group: 'farm', speciesRarity: 'uncommon',
    tags: ['intelligent', 'cute', 'funny', 'smart', 'social'],
    keyword: 'pig',
    wikiArticles: ['Pig', 'Miniature_pig', 'Kunekune'],
    facts: [
      'Pigs are smarter than dogs and rank in the top 5 most intelligent animals!',
      'Pigs can play basic video games with joysticks.',
      'Pigs don\'t sweat — they roll in mud to cool down.',
      'A pig\'s snout can detect odors 25 feet underground.',
      'Baby pigs can recognize their mother\'s voice within hours of birth.',
    ],
  },
  {
    id: 'sheep', name: 'Sheep', emoji: '🐑', group: 'farm', speciesRarity: 'uncommon',
    tags: ['fluffy', 'gentle', 'cute', 'soft', 'peaceful'],
    keyword: 'sheep',
    wikiArticles: ['Sheep', 'Merino', 'Valais_Blacknose_sheep', 'Texel_(sheep)'],
    facts: [
      'Sheep can recognize up to 50 other sheep faces — and remember them for years!',
      'Sheep self-medicate by seeking out specific plants when they feel ill.',
      'A Valais Blacknose is often called the world\'s cutest sheep.',
      'Sheep have rectangular pupils for super-wide panoramic vision.',
      'Baby sheep are called lambs.',
    ],
  },
  {
    id: 'goats', name: 'Goats', emoji: '🐐', group: 'farm', speciesRarity: 'uncommon',
    tags: ['funny', 'playful', 'mischievous', 'agile', 'clever'],
    keyword: 'goat',
    wikiArticles: ['Domestic_goat', 'Pygmy_goat', 'Nigerian_Dwarf_goat', 'Nubian_goat'],
    facts: [
      'Goats can climb almost vertical slopes and even certain trees!',
      'Goat pupils are rectangular for an extremely wide field of view.',
      'Goats were one of the first animals domesticated — over 10,000 years ago.',
      'Baby goats (kids) can walk within hours of birth.',
      'Goats can recognize human emotions and prefer happy faces.',
    ],
  },
  {
    id: 'chickens', name: 'Chickens', emoji: '🐔', group: 'farm', speciesRarity: 'common',
    tags: ['funny', 'quirky', 'colorful', 'social', 'intelligent'],
    keyword: 'chicken',
    wikiArticles: ['Chicken', 'Silkie', 'Plymouth_Rock_chicken', 'Orpington_chicken'],
    facts: [
      'Chickens can remember and recognize over 100 different faces!',
      'Hens communicate with their chicks while they\'re still inside the egg.',
      'Chickens dream during REM sleep just like humans.',
      'A rooster does a specific dance called "tidbitting" to attract hens.',
      'Chickens have a complex social hierarchy called a pecking order.',
    ],
  },
  {
    id: 'ducks', name: 'Ducks', emoji: '🦆', group: 'farm', speciesRarity: 'common',
    tags: ['cute', 'wholesome', 'water', 'funny', 'social'],
    keyword: 'duck',
    wikiArticles: [
      'Mallard', 'Pekin_duck', 'Call_duck', 'Indian_Runner_duck', 'Cayuga_duck',
    ],
    facts: [
      'Ducks have waterproof feathers thanks to special oil glands!',
      'Baby ducks imprint on the first moving thing they see after hatching.',
      'Ducks can sleep with one eye open to watch for predators.',
      'A group of ducks on water is called a paddling.',
      'Duck feet have no nerve endings, so cold water never hurts them.',
    ],
  },

  // ── OCEAN ───────────────────────────────────────────────────────────────
  {
    id: 'dolphins', name: 'Dolphins', emoji: '🐬', group: 'ocean', speciesRarity: 'rare',
    tags: ['intelligent', 'playful', 'amazing', 'friendly', 'social'],
    keyword: 'dolphin',
    wikiArticles: [
      'Bottlenose_dolphin', 'Common_dolphin', 'Spinner_dolphin', 'Orca',
    ],
    facts: [
      'Dolphins give each other unique names — their own signature whistles!',
      'Dolphins sleep with one eye open and only half their brain at a time.',
      'Dolphins have been documented rescuing humans from sharks.',
      'Dolphins recognize themselves in mirrors — a rare sign of self-awareness.',
      'A group of dolphins is called a pod.',
    ],
  },
  {
    id: 'seals', name: 'Seals', emoji: '🦭', group: 'ocean', speciesRarity: 'rare',
    tags: ['cute', 'funny', 'water', 'adorable', 'playful'],
    keyword: 'seal',
    wikiArticles: ['Harbor_seal', 'Elephant_seal', 'Harp_seal', 'Weddell_seal'],
    facts: [
      'Seals can hold their breath for up to 2 hours!',
      'Baby seals triple their weight in the first 12 days of life.',
      'Seals can sleep underwater in a pose called "bottling".',
      'A group of seals on land is called a colony.',
      'Seal whiskers can detect fish from over 100 meters away.',
    ],
  },
  {
    id: 'whales', name: 'Whales', emoji: '🐳', group: 'ocean', speciesRarity: 'epic',
    tags: ['majestic', 'amazing', 'large', 'fascinating', 'gentle'],
    keyword: 'whale',
    wikiArticles: [
      'Blue_whale', 'Humpback_whale', 'Beluga_whale', 'Narwhal', 'Sperm_whale',
    ],
    facts: [
      'Blue whales are the largest animals ever known to have existed!',
      'Humpback whales sing complex songs that evolve and spread across oceans.',
      'Narwhals\' spiral "horns" are actually enormous tusks.',
      'Beluga whales are called "canaries of the sea" for their chirps and clicks.',
      'A whale\'s heartbeat can slow to just 2 beats per minute during deep dives.',
    ],
  },
  {
    id: 'octopuses', name: 'Octopuses', emoji: '🐙', group: 'ocean', speciesRarity: 'rare',
    tags: ['intelligent', 'amazing', 'weird', 'fascinating', 'colorful'],
    keyword: 'octopus',
    wikiArticles: [
      'Common_octopus', 'Mimic_octopus', 'Giant_Pacific_octopus',
    ],
    facts: [
      'Octopuses have three hearts and blue blood!',
      'Each of an octopus\'s arms has its own mini-brain and can act independently.',
      'Octopuses can change color and texture in under 300 milliseconds.',
      'Octopuses are master escape artists — they squeeze through any gap the size of their beak.',
      'Mother octopuses guard their eggs for months without eating, then die.',
    ],
  },
  {
    id: 'sharks', name: 'Sharks', emoji: '🦈', group: 'ocean', speciesRarity: 'rare',
    tags: ['fierce', 'amazing', 'misunderstood', 'ancient', 'powerful'],
    keyword: 'shark',
    wikiArticles: [
      'Great_white_shark', 'Whale_shark', 'Hammerhead_shark', 'Nurse_shark', 'Wobbegong',
    ],
    facts: [
      'Sharks are older than trees — they\'ve swum Earth\'s oceans for 450 million years!',
      'Whale sharks are the largest fish in the ocean — up to 40 feet long.',
      'Sharks have special electroreceptors called the ampullae of Lorenzini.',
      'A shark\'s skin is covered in tiny tooth-like scales called dermal denticles.',
      'Some sharks must keep swimming constantly to breathe.',
    ],
  },

  // ── BIRDS ───────────────────────────────────────────────────────────────
  {
    id: 'birds', name: 'Parrots', emoji: '🦜', group: 'birds', speciesRarity: 'common',
    tags: ['colorful', 'intelligent', 'cute', 'talking', 'social'],
    keyword: 'parrot',
    wikiArticles: [
      'Budgerigar', 'Cockatiel', 'African_grey_parrot',
      'Lovebird', 'Cockatoo', 'Monk_parakeet', 'Sun_conure',
    ],
    facts: [
      'African grey parrots can learn and use over 1,000 words!',
      'Parrots can live up to 80 years — longer than most humans.',
      'Parrots are among the only animals that can truly mimic speech.',
      'Budgerigars can recognize themselves in a mirror.',
      'Lovebirds pine away if separated from their bonded mate.',
    ],
  },
  {
    id: 'penguins', name: 'Penguins', emoji: '🐧', group: 'birds', speciesRarity: 'rare',
    tags: ['cute', 'funny', 'wholesome', 'waddle', 'social'],
    keyword: 'penguin',
    wikiArticles: [
      'Emperor_penguin', 'African_penguin',
      'Little_penguin', 'Macaroni_penguin', 'Gentoo_penguin',
    ],
    facts: [
      'Penguins propose to mates by presenting a special pebble!',
      'Male emperor penguins balance eggs on their feet for 2 months — without eating.',
      'Penguins can swim up to 25 mph underwater.',
      'Penguins can drink salt water — a special gland filters out the salt.',
      'A group of penguins swimming together is called a raft.',
    ],
  },
  {
    id: 'owls', name: 'Owls', emoji: '🦉', group: 'birds', speciesRarity: 'uncommon',
    tags: ['wise', 'mysterious', 'beautiful', 'nocturnal', 'silent'],
    keyword: 'owl',
    wikiArticles: [
      'Barn_owl', 'Great_horned_owl', 'Snowy_owl', 'Burrowing_owl', 'Elf_owl',
    ],
    facts: [
      'Owls can rotate their heads 270 degrees!',
      'Owls have eye tubes, not eyeballs — they cannot move their eyes.',
      'A group of owls is called a parliament.',
      'Owls have specialized feathers for completely silent flight.',
      'The elf owl is the world\'s smallest owl — no bigger than a sparrow.',
    ],
  },
  {
    id: 'eagles', name: 'Eagles', emoji: '🦅', group: 'birds', speciesRarity: 'uncommon',
    tags: ['majestic', 'powerful', 'beautiful', 'soaring', 'fierce'],
    keyword: 'eagle',
    wikiArticles: [
      'Bald_eagle', 'Golden_eagle', 'Harpy_eagle', 'Philippine_eagle',
    ],
    facts: [
      'Eagles can see up to 8× more clearly than humans!',
      'Eagles mate for life and return to the same nest every year.',
      'A bald eagle\'s nest can weigh over a ton.',
      'Eagles can fly above storm clouds at over 10,000 feet.',
      'Harpy eagle talons are as large as grizzly bear claws.',
    ],
  },
  {
    id: 'flamingos', name: 'Flamingos', emoji: '🦩', group: 'birds', speciesRarity: 'rare',
    tags: ['colorful', 'elegant', 'funny', 'pink', 'social'],
    keyword: 'flamingo',
    wikiArticles: ['Flamingo', 'American_flamingo', 'Greater_flamingo'],
    facts: [
      'Flamingos are pink because of the pigments in the algae and shrimp they eat!',
      'Flamingos turn their bill upside down to filter-feed in water.',
      'A group of flamingos is called a flamboyance.',
      'Baby flamingos are born grey — they turn pink over 2 years.',
      'Flamingos can live up to 30 years in the wild.',
    ],
  },
  {
    id: 'puffins', name: 'Puffins', emoji: '🐦', group: 'birds', speciesRarity: 'rare',
    tags: ['cute', 'funny', 'colorful', 'ocean', 'adorable'],
    keyword: 'puffin',
    wikiArticles: ['Atlantic_puffin', 'Tufted_puffin', 'Horned_puffin'],
    facts: [
      'Puffins can carry up to 62 fish in their beak at once!',
      'Puffins flap their wings 400 times per minute when flying.',
      'Puffins can dive 200 feet underwater to catch fish.',
      'Puffins mate for life and reunite at the same burrow each spring.',
      'Baby puffins are called pufflings.',
    ],
  },
  {
    id: 'toucans', name: 'Toucans', emoji: '🦜', group: 'birds', speciesRarity: 'rare',
    tags: ['colorful', 'exotic', 'unique', 'tropical', 'beautiful'],
    keyword: 'toucan',
    wikiArticles: ['Toco_toucan', 'Keel-billed_toucan', 'Toucan'],
    facts: [
      'A toucan\'s enormous beak is actually hollow and very lightweight!',
      'Toucans use their beaks to regulate body temperature like a radiator.',
      'Toucans sleep by folding their tails forward over their backs.',
      'Toucans live in flocks of 6 to 20 birds.',
      'A toucan\'s beak can be up to half the length of its entire body.',
    ],
  },
  {
    id: 'peacocks', name: 'Peacocks', emoji: '🦚', group: 'birds', speciesRarity: 'exotic',
    tags: ['colorful', 'stunning', 'majestic', 'iridescent', 'beautiful'],
    keyword: 'peacock',
    wikiArticles: ['Indian_peafowl', 'Peacock', 'Green_peafowl'],
    facts: [
      'A peacock\'s tail feathers make up 60% of its entire body length!',
      'The eye-spots on a peacock\'s tail are called ocelli.',
      'Peacocks can fly short distances despite their enormous tails.',
      'Female peahens choose mates based on the symmetry and quality of the display.',
      'Baby peacocks are called peachicks.',
    ],
  },
  {
    id: 'birds-of-paradise', name: 'Birds of Paradise', emoji: '🌺', group: 'birds', speciesRarity: 'exotic',
    tags: ['stunning', 'colorful', 'dancing', 'exotic', 'extraordinary'],
    keyword: 'bird-of-paradise',
    wikiArticles: ['Bird-of-paradise', 'Superb_bird-of-paradise', 'King_bird-of-paradise'],
    facts: [
      'Male birds of paradise perform elaborate dances to attract females — some look like UFOs!',
      'There are over 40 species of birds of paradise, all native to New Guinea.',
      'Their feathers display structural color that changes with viewing angle.',
      'Some males clear a dance floor on the forest ground, arranging it perfectly.',
      'Female birds of paradise are plain brown — nature\'s ultimate camouflage.',
    ],
  },
  {
    id: 'geese', name: 'Geese', emoji: '🪿', group: 'birds', speciesRarity: 'common',
    tags: ['funny', 'territorial', 'quirky', 'social', 'determined'],
    keyword: 'goose',
    wikiArticles: ['Canada_goose', 'Snow_goose', 'Greylag_goose'],
    facts: [
      'Geese fly in V-formation — each bird benefits from the uplift created by the one ahead!',
      'Geese mate for life and genuinely mourn when their partner dies.',
      'A group of geese in flight is called a skein.',
      'Goslings can swim and walk within hours of hatching.',
      'Geese are fierce protectors and will charge predators much larger than themselves.',
    ],
  },
  {
    id: 'shoebill', name: 'Shoebill Storks', emoji: '🦤', group: 'birds', speciesRarity: 'epic',
    tags: ['prehistoric', 'weird', 'ancient', 'bizarre', 'fascinating'],
    keyword: 'shoebill',
    wikiArticles: ['Shoebill'],
    facts: [
      'The shoebill stands motionless for hours before lunging at prey with explosive speed!',
      'Shoebills have been called "the most terrifying bird in the world."',
      'Their clatter-like greeting sounds like machine gun fire.',
      'Shoebills can stand 5 feet tall with a 9-foot wingspan.',
      'Shoebills bow to each other as a greeting ritual.',
    ],
  },

  // ── WILD ────────────────────────────────────────────────────────────────
  {
    id: 'foxes', name: 'Foxes', emoji: '🦊', group: 'wild', speciesRarity: 'uncommon',
    tags: ['cute', 'clever', 'fluffy', 'mysterious', 'agile'],
    keyword: 'fox',
    wikiArticles: ['Red_fox', 'Arctic_fox', 'Gray_fox'],
    facts: [
      'Foxes use Earth\'s magnetic field as a targeting system when pouncing on prey!',
      'The fennec fox\'s enormous ears radiate body heat to stay cool in the desert.',
      'A fox\'s home is called a den, earth, or lair.',
      'A group of foxes is called a skulk or leash.',
      'Arctic foxes can survive temperatures as low as −94°F.',
    ],
  },
  {
    id: 'fennec-fox', name: 'Fennec Fox', emoji: '🦊', group: 'wild', speciesRarity: 'rare',
    tags: ['cute', 'tiny', 'enormous-ears', 'desert', 'adorable'],
    keyword: 'fennec',
    wikiArticles: ['Fennec_fox'],
    facts: [
      'The fennec fox has the largest ears relative to body size of any canid!',
      'Fennec fox ears can detect prey moving underground.',
      'Fennec foxes can survive indefinitely without free water — they get moisture from food.',
      'Fennec foxes are the smallest of all fox species, weighing under 4 pounds.',
      'Fennec fox paws have furry soles to protect from scorching desert sand.',
    ],
  },
  {
    id: 'wolves', name: 'Wolves', emoji: '🐺', group: 'wild', speciesRarity: 'uncommon',
    tags: ['majestic', 'fierce', 'loyal', 'social', 'powerful'],
    keyword: 'wolf',
    wikiArticles: ['Gray_wolf', 'Arctic_wolf', 'Ethiopian_wolf'],
    facts: [
      'Wolves can travel up to 30 miles in a single day!',
      'A wolf\'s howl can be heard up to 10 miles away.',
      'Wolves are apex predators that help regulate entire ecosystems.',
      'A wolf pack is led by a monogamous breeding pair.',
      'Wolves and dogs share 99.9% of their DNA.',
    ],
  },
  {
    id: 'bears', name: 'Bears', emoji: '🐻', group: 'wild', speciesRarity: 'rare',
    tags: ['large', 'cute', 'powerful', 'fluffy', 'majestic'],
    keyword: 'bear',
    wikiArticles: [
      'Brown_bear', 'Polar_bear', 'American_black_bear', 'Sun_bear', 'Spectacled_bear',
    ],
    facts: [
      'Bears can run at 35 mph despite their massive size!',
      'Polar bears have black skin under white fur to absorb maximum heat.',
      'A bear\'s heart rate can slow to just 8 beats per minute during hibernation.',
      'Bears can smell food from up to 20 miles away.',
      'Sun bears have the longest tongue of any bear — for reaching honey in beehives.',
    ],
  },
  {
    id: 'deer', name: 'Deer', emoji: '🦌', group: 'wild', speciesRarity: 'uncommon',
    tags: ['graceful', 'gentle', 'beautiful', 'soft', 'peaceful'],
    keyword: 'deer',
    wikiArticles: ['White-tailed_deer', 'Red_deer', 'Reindeer', 'Roe_deer'],
    facts: [
      'Deer antlers are the fastest-growing tissue of any mammal!',
      'Only male deer grow antlers — except in reindeer, where females have them too.',
      'A fawn\'s spots act as dappled-light camouflage in forests.',
      'Deer can leap up to 10 feet high and 30 feet in a single bound.',
      'Reindeer can detect UV light — which helps them spot predators in Arctic snow.',
    ],
  },
  {
    id: 'otters', name: 'Otters', emoji: '🦦', group: 'wild', speciesRarity: 'uncommon',
    tags: ['adorable', 'wholesome', 'water', 'playful', 'cute'],
    keyword: 'otter',
    wikiArticles: [
      'Sea_otter', 'North_American_river_otter', 'European_otter', 'Giant_otter',
    ],
    facts: [
      'Sea otters hold hands while sleeping so they don\'t drift apart!',
      'Otters have the densest fur of any mammal — up to 1 million hairs per square inch.',
      'Sea otters are one of very few tool-using mammals — they use rocks to crack shellfish.',
      'A group of otters is called a romp.',
      'Giant river otters grow up to 6 feet long.',
    ],
  },
  {
    id: 'raccoons', name: 'Raccoons', emoji: '🦝', group: 'wild', speciesRarity: 'uncommon',
    tags: ['clever', 'mischievous', 'funny', 'adaptable', 'curious'],
    keyword: 'raccoon',
    wikiArticles: ['Raccoon'],
    facts: [
      'Raccoons can open locks, latches, and even doorknobs!',
      'Raccoons can remember solutions to tasks for up to 3 years.',
      'Raccoons "wash" their food — their hands become more sensitive when wet.',
      'A group of raccoons is called a gaze.',
      'Raccoons have become one of the most adaptable animals on Earth.',
    ],
  },
  {
    id: 'squirrels', name: 'Squirrels', emoji: '🐿️', group: 'wild', speciesRarity: 'common',
    tags: ['cute', 'agile', 'funny', 'playful', 'energetic'],
    keyword: 'squirrel',
    wikiArticles: [
      'Eastern_gray_squirrel', 'Red_squirrel', 'Fox_squirrel', 'Douglas_squirrel',
    ],
    facts: [
      'Squirrels accidentally plant millions of trees by forgetting where they buried their nuts!',
      'A squirrel\'s front teeth grow 6 inches per year.',
      'Squirrels can locate food buried under 12 inches of snow.',
      'Flying squirrels don\'t actually fly — they glide up to 300 feet.',
      'Squirrels zigzag unpredictably at top speed to outrun predators.',
    ],
  },
  {
    id: 'servals', name: 'Servals', emoji: '🐆', group: 'wild', speciesRarity: 'exotic',
    tags: ['elegant', 'spotted', 'agile', 'wild-cat', 'striking'],
    keyword: 'serval',
    wikiArticles: ['Serval'],
    facts: [
      'Servals have the highest hunting success rate of any wild cat — about 50%!',
      'Servals can jump 9 feet straight up to catch birds mid-flight.',
      'Their enormous ears can locate prey beneath tall grass without seeing it.',
      'Servals are the fastest small cats in Africa, reaching 45 mph.',
      'A serval\'s spots and stripes are as unique as fingerprints.',
    ],
  },

  // ── EXOTIC ──────────────────────────────────────────────────────────────
  {
    id: 'capybaras', name: 'Capybaras', emoji: '🦫', group: 'exotic', speciesRarity: 'rare',
    tags: ['funny', 'wholesome', 'chill', 'social', 'relaxed'],
    keyword: 'capybara',
    wikiArticles: ['Capybara'],
    facts: [
      'Capybaras are the world\'s largest rodents — up to 150 lbs!',
      'Capybaras are so relaxed that birds, monkeys, and even cats use them as chairs.',
      'Capybaras are semi-aquatic and can hold their breath for 5 minutes.',
      'A group of capybaras is called a herd.',
      'Capybaras communicate with clicks, whistles, and dog-like barks.',
    ],
  },
  {
    id: 'sloths', name: 'Sloths', emoji: '🦥', group: 'exotic', speciesRarity: 'epic',
    tags: ['slow', 'cute', 'relaxed', 'wholesome', 'gentle'],
    keyword: 'sloth',
    wikiArticles: ['Three-toed_sloth', 'Two-toed_sloth'],
    facts: [
      'Sloths move so slowly that algae grows on their fur — acting as camouflage!',
      'Sloths take 2 weeks to fully digest a single meal.',
      'Baby sloths cry "eee" sounds when separated from their mothers.',
      'Despite being slow on land, sloths are surprisingly strong swimmers.',
      'Sloths can rotate their heads 270 degrees, just like owls.',
    ],
  },
  {
    id: 'koalas', name: 'Koalas', emoji: '🐨', group: 'exotic', speciesRarity: 'rare',
    tags: ['sleepy', 'cute', 'fluffy', 'adorable', 'peaceful'],
    keyword: 'koala',
    wikiArticles: ['Koala'],
    facts: [
      'Koalas sleep 18–22 hours per day to conserve energy!',
      'Koala fingerprints are virtually identical to human fingerprints.',
      'Koalas get almost all their water from eucalyptus leaves.',
      'Baby koalas (joeys) are the size of a jellybean at birth.',
      'Koalas have two opposable thumbs on each hand for gripping branches.',
    ],
  },
  {
    id: 'pandas', name: 'Pandas', emoji: '🐼', group: 'exotic', speciesRarity: 'rare',
    tags: ['cute', 'fluffy', 'wholesome', 'gentle', 'rare'],
    keyword: 'panda',
    wikiArticles: ['Giant_panda'],
    facts: [
      'Giant pandas spend 10–14 hours eating bamboo every single day!',
      'Baby pandas are born the size of a stick of butter.',
      'Pandas have a "false thumb" — actually an enlarged wrist bone.',
      'Giant pandas are documented rolling down hills purely for fun.',
      'Pandas are excellent tree-climbers despite their considerable size.',
    ],
  },
  {
    id: 'red-pandas', name: 'Red Pandas', emoji: '🦝', group: 'exotic', speciesRarity: 'rare',
    tags: ['adorable', 'fluffy', 'unique', 'cute', 'rare'],
    keyword: 'redpanda',
    wikiArticles: ['Red_panda'],
    facts: [
      'Red pandas use their bushy tails as blankets when sleeping!',
      'Red pandas are more closely related to weasels than to giant pandas.',
      'Red pandas can rotate their ankles to descend trees headfirst.',
      'A group of red pandas is called an embarrassment.',
      'Red pandas are crepuscular — most active at dawn and dusk.',
    ],
  },
  {
    id: 'meerkats', name: 'Meerkats', emoji: '🐾', group: 'exotic', speciesRarity: 'uncommon',
    tags: ['funny', 'social', 'cute', 'curious', 'organized'],
    keyword: 'meerkat',
    wikiArticles: ['Meerkat'],
    facts: [
      'Meerkats are immune to certain scorpion and snake venoms!',
      'Meerkats take turns as sentinels while the rest of the group forages.',
      'Baby meerkats are called pups.',
      'Meerkats do daily "sun salutations" — standing upright to warm their dark bellies.',
      'Meerkats have a vocabulary of over 30 distinct calls.',
    ],
  },
  {
    id: 'alpacas', name: 'Alpacas', emoji: '🦙', group: 'exotic', speciesRarity: 'uncommon',
    tags: ['fluffy', 'funny', 'cute', 'gentle', 'quirky'],
    keyword: 'alpaca',
    wikiArticles: ['Alpaca'],
    facts: [
      'Alpacas hum to communicate — they even hum softly when worried!',
      'Alpaca fiber is softer than cashmere and completely hypoallergenic.',
      'Alpacas spit when annoyed or threatened.',
      'A group of alpacas is called a herd.',
      'Alpacas are the smallest members of the camel family.',
    ],
  },
  {
    id: 'quokkas', name: 'Quokkas', emoji: '🦘', group: 'exotic', speciesRarity: 'exotic',
    tags: ['cute', 'smiling', 'wholesome', 'unique', 'happy'],
    keyword: 'quokka',
    wikiArticles: ['Quokka'],
    facts: [
      'Quokkas are called the happiest animals on Earth — they always look like they\'re smiling!',
      'Quokkas are a type of wallaby native to Rottnest Island, Australia.',
      'Baby quokkas are called joeys and live in their mother\'s pouch for 6 months.',
      'Quokkas will fearlessly approach humans — perfect for selfies!',
      'Quokkas can survive dry seasons by living off fat stored in their tails.',
    ],
  },
  {
    id: 'sugar-gliders', name: 'Sugar Gliders', emoji: '🐿️', group: 'exotic', speciesRarity: 'exotic',
    tags: ['tiny', 'gliding', 'exotic', 'nocturnal', 'adorable'],
    keyword: 'sugar-glider',
    wikiArticles: ['Sugar_glider'],
    facts: [
      'Sugar gliders can glide up to 150 feet from tree to tree using a membrane called a patagium!',
      'Sugar gliders bond for life — they groom and sleep together in groups.',
      'They get their name from their love of sweet nectar and sap.',
      'Sugar gliders can lower their body temperature to hibernate during cold weather.',
      'Their large eyes are adapted for perfect night vision.',
    ],
  },
  {
    id: 'lemurs', name: 'Lemurs', emoji: '🐒', group: 'exotic', speciesRarity: 'exotic',
    tags: ['quirky', 'colorful', 'unique', 'Madagascar', 'ancient'],
    keyword: 'lemur',
    wikiArticles: ['Ring-tailed_lemur', 'Indri', 'Aye-aye', 'Lemur'],
    facts: [
      'Lemurs have toilet claws — special nails for grooming their fur!',
      'Ring-tailed lemurs have a sunbathing posture they call "sun worship."',
      'Lemur groups are led by females — they have dominance over males.',
      'Indri lemurs sing territorial songs that can be heard 3 km away.',
      'Lemurs only exist naturally in Madagascar.',
    ],
  },
  {
    id: 'kinkajous', name: 'Kinkajous', emoji: '🐝', group: 'exotic', speciesRarity: 'epic',
    tags: ['nocturnal', 'cute', 'tropical', 'agile', 'social'],
    keyword: 'kinkajou',
    wikiArticles: ['Kinkajou'],
    facts: [
      'Kinkajous can rotate their feet backward so they can run up or down trees headfirst!',
      'Their long tongues are perfect for reaching nectar inside flowers.',
      'Kinkajous are sometimes called "honey bears" due to their love of nectar.',
      'Kinkajous are related to raccoons and coatis, not bears.',
      'Baby kinkajous are called kinkajou pups and are raised by their mothers alone.',
    ],
  },
  {
    id: 'tree-kangaroos', name: 'Tree Kangaroos', emoji: '🦘', group: 'exotic', speciesRarity: 'epic',
    tags: ['unusual', 'climbing', 'cute', 'marsupial', 'tropical'],
    keyword: 'tree-kangaroo',
    wikiArticles: ['Tree_kangaroo', 'Goodfellow\'s_tree_kangaroo'],
    facts: [
      'Tree kangaroos can jump 60 feet down from a tree to the ground and walk away unharmed!',
      'Unlike their ground-dwelling cousins, tree kangaroos can move their legs independently.',
      'They are the largest tree-dwelling mammals in Australia.',
      'Tree kangaroo joeys spend about 9 months in their mother\'s pouch.',
      'They are critically endangered due to habitat loss in Papua New Guinea.',
    ],
  },

  // ── REPTILES ────────────────────────────────────────────────────────────
  {
    id: 'turtles', name: 'Turtles', emoji: '🐢', group: 'reptiles', speciesRarity: 'uncommon',
    tags: ['slow', 'cute', 'ancient', 'patient', 'peaceful'],
    keyword: 'turtle',
    wikiArticles: [
      'Sea_turtle', 'Galapagos_tortoise', 'Red-eared_slider', 'Painted_turtle', 'Box_turtle',
    ],
    facts: [
      'Turtles have been on Earth for over 200 million years!',
      'Sea turtles travel 10,000+ miles to return to the exact beach where they were born.',
      'Galápagos tortoises can live to 175 years old.',
      'Turtles cannot leave their shells — they\'re fused to the spine.',
      'A group of turtles is called a bale.',
    ],
  },
  {
    id: 'lizards', name: 'Lizards', emoji: '🦎', group: 'reptiles', speciesRarity: 'uncommon',
    tags: ['colorful', 'unique', 'fascinating', 'ancient', 'agile'],
    keyword: 'lizard',
    wikiArticles: [
      'Crested_gecko', 'Leopard_gecko', 'Blue-tongued_skink',
    ],
    facts: [
      'Geckos can walk on ceilings using millions of microscopic hair-like structures.',
      'A lizard\'s tongue is twice the length of its entire body in some species.',
      'Lizards can detach and regrow their tails when grabbed by predators.',
      'The blue-tongued skink uses its vivid blue tongue to startle predators.',
      'Geckos\' feet create a molecular attraction so strong they can hang from a single toe.',
    ],
  },
  {
    id: 'chameleons', name: 'Chameleons', emoji: '🦎', group: 'reptiles', speciesRarity: 'exotic',
    tags: ['colorful', 'camouflage', 'eyes', 'unique', 'extraordinary'],
    keyword: 'chameleon',
    wikiArticles: ['Chameleon', 'Panther_chameleon', 'Veiled_chameleon', 'Parson\'s_chameleon'],
    facts: [
      'Chameleons change color to communicate emotions — not just for camouflage!',
      'A chameleon\'s tongue can shoot out at 60 mph in 0.003 seconds.',
      'Chameleon eyes can move independently — looking in two directions at once.',
      'Some chameleons are smaller than a thumbnail when fully grown.',
      'Male chameleons change their brightest colors during courtship displays.',
    ],
  },
  {
    id: 'snakes', name: 'Snakes', emoji: '🐍', group: 'reptiles', speciesRarity: 'uncommon',
    tags: ['fascinating', 'misunderstood', 'unique', 'ancient', 'colorful'],
    keyword: 'snake',
    wikiArticles: [
      'Ball_python', 'Corn_snake', 'King_cobra', 'Emerald_tree_boa', 'Rainbow_boa',
    ],
    facts: [
      'Snakes "smell" with their tongues — they taste the air for scent particles!',
      'A ball python can live for over 30 years in captivity.',
      'The emerald tree boa is bright red at birth, then turns vivid green as an adult.',
      'Some snakes can go over a year without eating.',
      'Snakes have no eyelids — they sleep with their eyes permanently open.',
    ],
  },

  // ── AMPHIBIANS ──────────────────────────────────────────────────────────
  {
    id: 'axolotls', name: 'Axolotls', emoji: '🦎', group: 'amphibians', speciesRarity: 'epic',
    tags: ['unique', 'cute', 'weird', 'fascinating', 'rare'],
    keyword: 'axolotl',
    wikiArticles: ['Axolotl'],
    facts: [
      'Axolotls can regrow entire limbs, their heart, and even parts of their brain!',
      'Axolotls keep their larval "baby" features for their entire lives — called neoteny.',
      'Fewer than 1,000 axolotls survive in the wild — they are critically endangered.',
      'Axolotls appear to smile because of the upward curve of their mouths.',
      '"Axolotl" means "water monster" in the Aztec language Nahuatl.',
    ],
  },
  {
    id: 'frogs', name: 'Frogs', emoji: '🐸', group: 'amphibians', speciesRarity: 'uncommon',
    tags: ['colorful', 'funny', 'cute', 'unique', 'fascinating'],
    keyword: 'frog',
    wikiArticles: [
      'Red-eyed_tree_frog', 'Poison_dart_frog',
      'Strawberry_poison-dart_frog', 'African_bullfrog', 'Glass_frog',
    ],
    facts: [
      'A group of frogs is called an army!',
      'Some wood frogs survive being frozen completely solid in winter, then thaw alive in spring.',
      'Poison dart frogs get their toxicity from the ants and mites they eat.',
      'Frogs drink and breathe through their skin.',
      'Glass frogs have transparent bellies — you can see all their organs.',
    ],
  },

  // ── BABY ANIMALS ────────────────────────────────────────────────────────
  {
    id: 'baby-animals', name: 'Baby Animals', emoji: '🍼', group: 'baby', speciesRarity: 'common',
    tags: ['cute', 'tiny', 'adorable', 'wholesome', 'precious'],
    keyword: 'puppy',
    wikiArticles: ['Puppy', 'Kitten', 'Foal', 'Lamb_(animal)', 'Duckling', 'Calf'],
    facts: [
      'Baby sea otters (pups) can\'t swim at birth — they float on their mother\'s belly!',
      'A newborn kangaroo is the size of a grape when it crawls into the pouch.',
      'Baby giraffes can stand and run within hours of being born.',
      'Newborn elephants are nearly blind but can walk within their first hour.',
      'A baby panda is 900× smaller than its mother — one of the biggest size disparities in nature.',
    ],
  },

  // ── LEGENDARY ───────────────────────────────────────────────────────────
  {
    id: 'kakapo', name: 'Kakapo', emoji: '🦜', group: 'birds', speciesRarity: 'legendary',
    tags: ['rarest', 'endangered', 'nocturnal', 'flightless', 'ancient'],
    keyword: 'kakapo',
    wikiArticles: ['Kakapo'],
    facts: [
      'The kakapo is the world\'s only flightless parrot — and it\'s critically endangered with fewer than 250 alive!',
      'Kakapos can live up to 90 years — the longest lifespan of any bird.',
      'Kakapos only breed when a specific tree fruits, sometimes years apart.',
      'The kakapo is the heaviest parrot in the world, weighing up to 9 pounds.',
      'Each individual kakapo has its own name and is personally monitored by scientists.',
    ],
  },
  {
    id: 'saiga-antelope', name: 'Saiga Antelope', emoji: '🦌', group: 'wild', speciesRarity: 'legendary',
    tags: ['prehistoric', 'unique', 'endangered', 'ancient', 'alien'],
    keyword: 'saiga',
    wikiArticles: ['Saiga_antelope'],
    facts: [
      'The saiga antelope has a huge bulbous nose that filters out dust and warms cold air!',
      'Saiga antelopes have roamed Earth since the Ice Age alongside mammoths.',
      'Their population crashed 95% in a single week in 2015 due to a bacterial epidemic.',
      'Saigas can run at 50 mph across open steppes.',
      'Conservation efforts have helped saiga numbers recover to over 1 million.',
    ],
  },
  {
    id: 'aye-aye', name: 'Aye-Aye', emoji: '🐒', group: 'exotic', speciesRarity: 'legendary',
    tags: ['bizarre', 'nocturnal', 'magical', 'weird', 'Madagascar'],
    keyword: 'aye-aye',
    wikiArticles: ['Aye-aye'],
    facts: [
      'The aye-aye has a special elongated middle finger for extracting insects from bark!',
      'Aye-ayes use echolocation-like tapping to find hollow wood hiding grubs.',
      'In Malagasy folklore, the aye-aye is considered an omen of bad luck.',
      'The aye-aye is the world\'s largest nocturnal primate.',
      'Aye-ayes have continuously growing incisors like rodents — unique among primates.',
    ],
  },
  {
    id: 'okapi', name: 'Okapi', emoji: '🦒', group: 'wild', speciesRarity: 'legendary',
    tags: ['mysterious', 'forest-giraffe', 'striped', 'elusive', 'unique'],
    keyword: 'okapi',
    wikiArticles: ['Okapi'],
    facts: [
      'The okapi is the closest living relative of the giraffe, hidden in dense rainforests!',
      'Okapis were unknown to western science until 1901 — called the "African unicorn."',
      'An okapi\'s tongue is 18 inches long and dark blue-black.',
      'Okapi mothers hum to their calves — unique among the giraffe family.',
      'Okapis are so elusive that scientists still don\'t know their total population.',
    ],
  },
  {
    id: 'pangolin', name: 'Pangolin', emoji: '🦔', group: 'wild', speciesRarity: 'legendary',
    tags: ['armor', 'unique', 'endangered', 'ancient', 'misunderstood'],
    keyword: 'pangolin',
    wikiArticles: ['Pangolin', 'Sunda_pangolin', 'Chinese_pangolin'],
    facts: [
      'Pangolins are the only mammals covered entirely in scales made of keratin — like fingernails!',
      'When threatened, pangolins roll into a perfect ball and are nearly impossible to pry open.',
      'Pangolins consume up to 70 million ants and termites per year.',
      'A pangolin\'s tongue can be longer than its entire body when fully extended.',
      'Pangolins are the most trafficked mammal in the world — all 8 species are threatened.',
    ],
  },
  {
    id: 'vaquita', name: 'Vaquita', emoji: '🐬', group: 'ocean', speciesRarity: 'legendary',
    tags: ['rarest', 'endangered', 'ocean', 'precious', 'critically-endangered'],
    keyword: 'vaquita',
    wikiArticles: ['Vaquita'],
    facts: [
      'The vaquita is the world\'s rarest marine mammal — fewer than 10 remain!',
      'Vaquita means "little cow" in Spanish.',
      'The vaquita was only discovered in 1958 and may already be functionally extinct.',
      'Vaquitas are shy and elusive — they were rarely photographed even when plentiful.',
      'They have distinctive dark rings around their eyes and dark patches on their lips.',
    ],
  },
];
// ── Derived lookup structures ─────────────────────────────────────────────

/** O(1) lookup: animal id → AnimalEntry */
export const REGISTRY_BY_ID = new Map<string, AnimalEntry>(
  ANIMAL_REGISTRY.map((e) => [e.id, e]),
);

/** Group → AnimalEntry[] */
export const REGISTRY_BY_GROUP = ANIMAL_REGISTRY.reduce<Record<string, AnimalEntry[]>>(
  (acc, e) => {
    (acc[e.group] ??= []).push(e);
    return acc;
  },
  {},
);

export const GROUP_LABELS: Record<string, string> = {
  pets:       '🐾 Pets',
  farm:       '🚜 Farm',
  ocean:      '🌊 Ocean',
  birds:      '🐦 Birds',
  wild:       '🦊 Wild',
  exotic:     '🌴 Exotic',
  reptiles:   '🦎 Reptiles',
  amphibians: '🐸 Amphibians',
  baby:       '🐣 Baby',
};

export const GROUP_EMOJIS: Record<string, string> = {
  pets: '🐾', farm: '🚜', ocean: '🌊', birds: '🐦',
  wild: '🦊', exotic: '🌴', reptiles: '🦎', amphibians: '🐸', baby: '🐣',
};

export const GROUP_ORDER: string[] = [
  'pets', 'farm', 'ocean', 'birds', 'wild', 'exotic', 'reptiles', 'amphibians', 'baby',
];

/** All animal IDs (order matches ANIMAL_REGISTRY) */
export const ALL_ANIMAL_IDS = ANIMAL_REGISTRY.map((e) => e.id);

/** Get a random species-specific fact, or a generic fallback */
export function getAnimalFact(id: string): string {
  const entry = REGISTRY_BY_ID.get(id);
  if (!entry || entry.facts.length === 0) {
    return 'Every animal is a wonder of nature! 🌍';
  }
  return entry.facts[Math.floor(Math.random() * entry.facts.length)];
}

/** Get a random registry entry from a specific group */
export function randomFromGroup(group: string): AnimalEntry | null {
  const entries = REGISTRY_BY_GROUP[group] ?? [];
  if (entries.length === 0) return null;
  return entries[Math.floor(Math.random() * entries.length)];
}

/** Get all entries matching a tag */
export function getByTag(tag: string): AnimalEntry[] {
  return ANIMAL_REGISTRY.filter((e) => e.tags.includes(tag));
}

/** Seeded pseudo-random number (deterministic from a string key) */
export function seededRandom(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return ((h >>> 0) / 0xffffffff);
}
