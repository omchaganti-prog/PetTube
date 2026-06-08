/**
 * curatedShots.ts — Hand-curated image library for every species.
 *
 * Each species has a list of CuratedShots with:
 *   - article  : Wikipedia article slug (thumbnail is fetched via REST API)
 *   - type     : Emotional content category — drives priority ordering
 *   - label    : Human-readable description of the expected image
 *   - score    : Expected quality 1–10 (higher = shown first within same type)
 *
 * Priority order (highest → lowest):
 *   baby > funny > wholesome > expression > family > playful > beauty > portrait > action > standard
 *
 * Rule: Every shot chosen because it creates one of:
 *   😍 "That's adorable."   😂 "That's hilarious."
 *   🥹 "That's precious."   🤯 "I've never seen that before."   ❤️ "I want to favorite that."
 */

export type ImageType =
  | 'baby'        // Young/juvenile animal — highest emotional impact
  | 'funny'       // Humorous pose or expression
  | 'wholesome'   // Heartwarming interaction
  | 'expression'  // Striking facial close-up
  | 'family'      // Parent + young or bonded group
  | 'playful'     // Active, mid-action fun
  | 'beauty'      // Stunning visual/wildlife portrait
  | 'portrait'    // Clean breed/species portrait
  | 'action'      // Movement or behavior
  | 'standard';   // Generic species image (last resort)

export interface CuratedShot {
  article: string;  // Wikipedia article slug (URL-safe)
  type: ImageType;
  label: string;    // e.g., "Baby Harp Seal on Ice"
  score: number;    // Expected quality 1–10
}

// Priority weights — used to sort shots before fetching so the best appear first
const PRIORITY: Record<ImageType, number> = {
  baby: 100, funny: 90, wholesome: 80, expression: 70,
  family: 60, playful: 50, beauty: 40, portrait: 30, action: 20, standard: 10,
};

/** Composite sort key: type priority + quality score */
export function shotPriority(shot: CuratedShot): number {
  return (PRIORITY[shot.type] ?? 10) + shot.score;
}

/** Shorthand helper to build a CuratedShot */
function s(article: string, type: ImageType, label: string, score: number): CuratedShot {
  return { article, type, label, score };
}


// ---------------------------------------------------------------------------
// Curated shot libraries — 10–20 articles per species for maximum variety
// Target: every species should have enough images to avoid repetition
// ---------------------------------------------------------------------------

export const CURATED_SHOTS: Record<string, CuratedShot[]> = {

  // ── PETS ──────────────────────────────────────────────────────────────
  dogs: [
    s('Puppy',                    'baby',       'Adorable Puppy Pile',                10),
    s('Pembroke_Welsh_Corgi',     'funny',      'Iconic Corgi Run',                   10),
    s('Pomeranian_(dog)',         'expression', 'Fluffy Pomeranian Face',              9),
    s('Shiba_Inu',                'funny',      'Classic Shiba Inu Doge',              9),
    s('Samoyed_(dog)',            'portrait',   'Smiling Samoyed',                     9),
    s('Chow_Chow',                'funny',      'Lion-Like Chow Chow',                 9),
    s('Siberian_Husky',           'beauty',     'Striking Husky Portrait',             8),
    s('Golden_Retriever',         'wholesome',  'Golden Retriever Smile',              8),
    s('French_Bulldog',           'expression', 'Bat-Eared French Bulldog',            8),
    s('Dachshund',                'funny',      'Sausage Dog Close-Up',                8),
    s('Bernese_Mountain_Dog',     'portrait',   'Bernese Mountain Dog',                8),
    s('Australian_Shepherd',      'beauty',     'Merle Australian Shepherd',           8),
    s('Maltese_dog',              'portrait',   'Snow-White Maltese',                  8),
    s('Akita_(dog)',              'beauty',     'Regal Akita Portrait',                8),
    s('Border_Collie',            'portrait',   'Focused Border Collie',               7),
    s('Labrador_Retriever',       'portrait',   'Labrador Portrait',                   7),
    s('Beagle',                   'portrait',   'Classic Beagle',                      7),
    s('Jack_Russell_Terrier',     'playful',    'Energetic Jack Russell',              7),
    s('Saint_Bernard',            'funny',      'Massive Gentle Saint Bernard',        7),
    s('Dalmatian_dog',            'portrait',   'Spotted Dalmatian',                   7),
  ],

  cats: [
    s('Kitten',                   'baby',       'Tiny Kitten Bundle',                 10),
    s('Scottish_Fold',            'expression', 'Owl-Faced Scottish Fold',            10),
    s('Persian_cat',              'expression', 'Squished Persian Face',               9),
    s('Maine_Coon',               'portrait',   'Majestic Maine Coon',                 9),
    s('Ragdoll_cat',              'wholesome',  'Floppy Ragdoll Cat',                  9),
    s('Sphynx_cat',               'expression', 'Hairless Wrinkled Sphynx',            9),
    s('Munchkin_cat',             'funny',      'Stubby-Legged Munchkin',              9),
    s('Bengal_cat',               'beauty',     'Wild Bengal Rosettes',                8),
    s('Norwegian_Forest_cat',     'beauty',     'Fluffy Norwegian Forest Cat',         8),
    s('British_Shorthair',        'expression', 'Chubby-Cheeked British Shorthair',    8),
    s('Siamese_cat',              'portrait',   'Classic Siamese',                     8),
    s('Russian_Blue',             'beauty',     'Silver-Grey Russian Blue',            8),
    s('Exotic_Shorthair',         'expression', 'Flat-Faced Exotic Shorthair',         8),
    s('Abyssinian_cat',           'beauty',     'Athletic Abyssinian',                 7),
    s('Turkish_Angora',           'portrait',   'Silky Turkish Angora',                7),
    s('Birman',                   'portrait',   'Sacred Birman Cat',                   7),
    s('American_Shorthair',       'portrait',   'Classic American Shorthair',          7),
    s('Tonkinese_(cat)',           'portrait',   'Playful Tonkinese Cat',               7),
  ],

  rabbits: [
    s('Holland_Lop',              'expression', 'Floppy-Eared Holland Lop',           10),
    s('Angora_rabbit',            'funny',      'Living Fluff Ball Angora',            9),
    s('Lionhead_rabbit',          'funny',      'Maned Lionhead Rabbit',               9),
    s('Flemish_Giant_rabbit',     'funny',      'Enormous Flemish Giant',              9),
    s('Netherland_Dwarf_rabbit',  'baby',       'Teacup Dwarf Rabbit',                 9),
    s('Mini_Lop',                 'expression', 'Cute Mini Lop',                       8),
    s('American_fuzzy_lop',       'portrait',   'Fuzzy American Lop',                  8),
    s('English_Lop',              'funny',      'Giant-Eared English Lop',             8),
    s('Rex_rabbit',               'portrait',   'Velvet Rex Rabbit',                   7),
    s('Domestic_rabbit',          'portrait',   'Classic Domestic Rabbit',             7),
    s('Polish_rabbit',            'portrait',   'Tiny Polish Rabbit',                  7),
    s('Harlequin_rabbit',         'portrait',   'Patchwork Harlequin Rabbit',          7),
    s('Snowshoe_hare',            'beauty',     'White Snowshoe Hare',                 7),
    s('European_rabbit',          'portrait',   'Wild European Rabbit',                6),
  ],

  hamsters: [
    s('Roborovski_hamster',       'baby',       'Tiny Roborovski Hamster',             9),
    s('Syrian_hamster',           'expression', 'Chubby-Cheeked Syrian Hamster',       9),
    s('Winter_white_dwarf_hamster','portrait',  'Winter White Hamster',                8),
    s('Dwarf_hamster',            'portrait',   'Fluffy Dwarf Hamster',                7),
    s('Chinese_hamster',          'portrait',   'Long-Tailed Chinese Hamster',         7),
    s('European_hamster',         'portrait',   'Wild European Hamster',               7),
    s("Campbell's_dwarf_hamster", 'portrait',   "Campbell's Dwarf Hamster",            7),
    s('Golden_hamster',           'expression', 'Golden Hamster With Pouches',         8),
    s('Black_bear_hamster',       'expression', 'Black Bear Hamster',                  7),
    s('Long-haired_hamster',      'portrait',   'Silky Long-Haired Hamster',           7),
  ],

  hedgehogs: [
    s('African_pygmy_hedgehog',   'baby',       'Baby Pygmy Hedgehog',                 9),
    s('Hedgehog',                 'expression', 'Hedgehog Nose Close-Up',              8),
    s('European_hedgehog',        'portrait',   'European Hedgehog',                   7),
    s('Long-eared_hedgehog',      'portrait',   'Big-Eared Desert Hedgehog',           7),
    s('Four-toed_hedgehog',       'portrait',   'Four-Toed Hedgehog',                  7),
    s('Indian_hedgehog',          'portrait',   'Indian Hedgehog',                     6),
    s('Desert_hedgehog',          'portrait',   'Desert Hedgehog',                     6),
    s('Amur_hedgehog',            'portrait',   'Amur Hedgehog',                       6),
    s('Southern_African_hedgehog','portrait',   'Southern African Hedgehog',           6),
    s('Lesser_hedgehog_tenrec',   'funny',      'Spiky Hedgehog Tenrec',               7),
  ],

  ferrets: [
    s('Ferret',                   'funny',      'War-Dancing Ferret',                  9),
    s('European_polecat',         'portrait',   'Wild Polecat Ancestor',               7),
    s('Black-footed_ferret',      'beauty',     'Endangered Black-Footed Ferret',      8),
    s('Siberian_polecat',         'portrait',   'Siberian Polecat',                    7),
    s('Marbled_polecat',          'beauty',     'Striking Marbled Polecat',            8),
    s('Striped_polecat',          'portrait',   'Striped African Polecat',             7),
    s('Least_weasel',             'funny',      'Tiny Curious Weasel',                 7),
    s('Stoat',                    'beauty',     'Stoat in White Winter Coat',          8),
    s('American_mink',            'portrait',   'Sleek American Mink',                 6),
    s('Weasel',                   'portrait',   'Weasel Portrait',                     6),
  ],

  'guinea-pigs': [
    s('Abyssinian_guinea_pig',    'funny',      'Crazy-Haired Abyssinian',             9),
    s('Guinea_pig',               'portrait',   'Round Guinea Pig',                    8),
    s('Peruvian_guinea_pig',      'funny',      'Long-Haired Peruvian',                8),
    s('Teddy_guinea_pig',         'expression', 'Soft Teddy Guinea Pig',               8),
    s('Skinny_pig',               'funny',      'Bald Hairless Skinny Pig',            8),
    s('Rex_guinea_pig',           'portrait',   'Curly Rex Guinea Pig',                7),
    s('Sheltie_guinea_pig',       'portrait',   'Flowing Sheltie Guinea Pig',          7),
    s('Texel_guinea_pig',         'funny',      'Ringlet-Haired Texel',                8),
    s('Coronet_guinea_pig',       'portrait',   'Crown-Crested Coronet',               7),
    s('American_guinea_pig',      'portrait',   'Classic American Guinea Pig',         6),
  ],

  // ── FARM ──────────────────────────────────────────────────────────────
  horses: [
    s('Foal',                     'baby',       'Wobbly Newborn Foal',                10),
    s('Shetland_pony',            'funny',      'Tiny Shetland Pony',                  9),
    s('Friesian_horse',           'beauty',     'Majestic Black Friesian',             9),
    s('Arabian_horse',            'beauty',     'Elegant Arabian Horse',               9),
    s('Andalusian_horse',         'beauty',     'Graceful Andalusian',                 8),
    s('Haflinger',                'wholesome',  'Golden Haflinger with Flaxen Mane',   8),
    s('Lipizzan',                 'beauty',     'White Lipizzaner Stallion',           8),
    s('Shire_horse',              'portrait',   'Massive Shire Horse',                 7),
    s('Horse',                    'portrait',   'Classic Horse Portrait',              7),
    s('Thoroughbred',             'action',     'Thoroughbred at Full Gallop',         7),
    s('Appaloosa',                'beauty',     'Spotted Appaloosa',                   7),
    s('Paint_horse',              'beauty',     'Pinto Paint Horse',                   7),
    s('Miniature_horse',          'funny',      'Impossibly Small Mini Horse',         8),
    s('Gypsy_horse',              'beauty',     'Feather-Legged Gypsy Vanner',         8),
  ],

  cows: [
    s('Calf',                     'baby',       'Newborn Calf with Big Eyes',         10),
    s('Highland_cattle',          'funny',      'Shaggy Long-Horned Highland',         9),
    s('Belted_Galloway',          'funny',      'Oreo-Belt Galloway Cow',              8),
    s('Jersey_cattle',            'wholesome',  'Sweet Jersey Cow',                    8),
    s('Hereford_cattle',          'portrait',   'Hereford Cattle',                     7),
    s('Watusi_cattle',            'expression', 'Giant-Horned Ankole-Watusi',          9),
    s('Dexter_cattle',            'portrait',   'Small Dexter Cow',                    7),
    s('Miniature_Hereford',       'funny',      'Tiny Miniature Cow',                  8),
    s('Zebu',                     'portrait',   'Humped Zebu Cattle',                  7),
    s('Yak',                      'portrait',   'Shaggy Mountain Yak',                 7),
    s('Water_buffalo',            'portrait',   'Water Buffalo Portrait',              6),
    s('Gaur',                     'portrait',   'Massive Wild Gaur',                   6),
  ],

  pigs: [
    s('Miniature_pig',            'funny',      'Micro Pig Close-Up',                 10),
    s('Kunekune',                 'funny',      'Hairy Kunekune Pig',                   8),
    s('Juliana_pig',              'portrait',   'Spotted Juliana Mini Pig',            8),
    s('Potbelly_pig',             'funny',      'Rolly Potbelly Pig',                  8),
    s('Hampshire_pig',            'portrait',   'Belted Hampshire Pig',                7),
    s('Berkshire_pig',            'portrait',   'Black Berkshire Pig',                 7),
    s('Mangalica',                'funny',      'Curly-Haired Sheep-Pig',              9),
    s('Pig',                      'standard',   'Classic Domestic Pig',                6),
    s('Warthog',                  'funny',      'Tusked Warthog',                      7),
    s('Babirusa',                 'expression', 'Curved-Tusk Babirusa',                7),
  ],

  sheep: [
    s('Lamb_(animal)',            'baby',       'Fluffy Baby Lamb',                   10),
    s('Valais_Blacknose_sheep',   'expression', 'World\'s Cutest Sheep',              10),
    s('Merino',                   'funny',      'Ultra-Fluffy Merino Wool',             8),
    s('Texel_(sheep)',            'portrait',   'Texel Sheep',                          7),
    s('Herdwick',                 'portrait',   'Rugged Herdwick Sheep',               7),
    s('Soay_sheep',               'portrait',   'Ancient Soay Sheep',                  7),
    s('Icelandic_sheep',          'portrait',   'Long-Haired Icelandic Sheep',         7),
    s('Jacob_sheep',              'expression', 'Multi-Horned Jacob Sheep',            8),
    s('Karakul_(sheep)',           'portrait',   'Curly Karakul Sheep',                 7),
    s('Babydoll_Southdown_sheep', 'wholesome',  'Tiny Babydoll Sheep',                 8),
    s('Dorper',                   'portrait',   'Black-Headed Dorper',                 6),
    s('East_Friesian_sheep',      'portrait',   'East Friesian Dairy Sheep',           6),
  ],

  goats: [
    s('Nigerian_Dwarf_goat',      'baby',       'Miniature Nigerian Goat Kid',         9),
    s('Pygmy_goat',               'funny',      'Tiny Mischievous Pygmy Goat',         9),
    s('Domestic_goat',            'funny',      'Cheeky Goat Expression',              8),
    s('Nubian_goat',              'portrait',   'Long-Eared Nubian Goat',              7),
    s('Boer_goat',                'portrait',   'Classic Boer Goat',                   7),
    s('Cashmere_goat',            'beauty',     'Silky Cashmere Goat',                 7),
    s('Myotonic_goat',            'funny',      'Famous Fainting Goat',                9),
    s('LaMancha_goat',            'expression', 'Tiny-Eared LaMancha',                 8),
    s('Angora_goat',              'beauty',     'Fluffy Angora Fiber Goat',            8),
    s('Mountain_goat',            'action',     'Cliff-Climbing Mountain Goat',        8),
    s('Alpine_goat',              'portrait',   'Swiss Alpine Dairy Goat',             6),
  ],

  chickens: [
    s('Silkie',                   'funny',      'Cloud Silkie Chicken',                9),
    s('Orpington_chicken',        'portrait',   'Fluffy Buff Orpington',               7),
    s('Plymouth_Rock_chicken',    'portrait',   'Barred Plymouth Rock',                7),
    s('Polish_chicken',           'funny',      'Pom-Pom Headed Polish Chicken',       9),
    s('Serama',                   'funny',      'World\'s Smallest Chicken',           8),
    s('Cochin_chicken',           'portrait',   'Giant Fluffy Cochin',                 7),
    s('Brahma_chicken',           'funny',      'Massive Brahma Giant Chicken',        8),
    s('Sultan_(chicken)',         'funny',      'Topknot Sultan Chicken',              8),
    s('Bantam',                   'funny',      'Tiny Bantam Chicken',                 7),
    s('Frizzle_(poultry)',        'funny',      'Wild Frizzle-Feathered Chicken',      9),
    s('Wyandotte_chicken',        'portrait',   'Laced Wyandotte Chicken',             7),
    s('Domestic_chicken',         'standard',   'Classic Chicken',                     5),
  ],

  ducks: [
    s('Duckling',                 'baby',       'Tiny Yellow Duckling',               10),
    s('Call_duck',                'funny',      'Miniature Call Duck',                  9),
    s('Indian_Runner_duck',       'funny',      'Upright Running Duck',                 9),
    s('Mandarin_duck',            'beauty',     'Stunning Mandarin Duck Drake',         9),
    s('Wood_duck',                'beauty',     'Colorful Wood Duck',                   8),
    s('Crested_duck',             'funny',      'Pompadour Crested Duck',               8),
    s('Pekin_duck',               'wholesome',  'Fluffy White Pekin',                   7),
    s('Mallard',                  'portrait',   'Iridescent Mallard Drake',             7),
    s('Cayuga_duck',              'beauty',     'Iridescent Black Cayuga',              7),
    s('Muscovy_duck',             'expression', 'Red-Faced Muscovy',                    7),
    s('Swedish_duck',             'portrait',   'Blue Swedish Duck',                    6),
  ],

  // ── OCEAN ─────────────────────────────────────────────────────────────
  dolphins: [
    s('Bottlenose_dolphin',       'playful',    'Leaping Bottlenose Dolphin',           9),
    s('Orca',                     'beauty',     'Magnificent Black-and-White Orca',     9),
    s('Spinner_dolphin',          'action',     'Aerial-Spinning Dolphin',              8),
    s('Common_dolphin',           'portrait',   'Common Dolphin',                       8),
    s('Dusky_dolphin',            'playful',    'Acrobatic Dusky Dolphin',              8),
    s('Pacific_white-sided_dolphin','beauty',   'Sleek Pacific Dolphin',               8),
    s('Amazon_river_dolphin',     'expression', 'Pink Amazon River Dolphin',           9),
    s('Irrawaddy_dolphin',        'wholesome',  'Smiling Irrawaddy Dolphin',            8),
    s('Pantropical_spotted_dolphin','action',   'Spotted Dolphin Bow-Riding',          7),
    s('Risso\'s_dolphin',          'portrait',   'Scarred Risso\'s Dolphin',             7),
    s('Pilot_whale',              'portrait',   'Friendly Pilot Whale',                 7),
  ],

  seals: [
    s('Harp_seal',                'baby',       'Baby White Harp Seal Pup',           10),
    s('Harbor_seal',              'expression', 'Puppy-Eyed Harbor Seal',              9),
    s('Ringed_seal',              'baby',       'Baby Ringed Seal Pup',                9),
    s('Bearded_seal',             'expression', 'Whiskery Bearded Seal',               8),
    s('Spotted_seal',             'wholesome',  'Spotted Seal Pup',                    8),
    s('Elephant_seal',            'funny',      'Big-Nosed Elephant Seal',             8),
    s('Weddell_seal',             'wholesome',  'Resting Weddell Seal',                8),
    s('Leopard_seal',             'beauty',     'Powerful Leopard Seal',               8),
    s('Crabeater_seal',           'portrait',   'Crabeater Seal Portrait',             7),
    s('Mediterranean_monk_seal',  'portrait',   'Rare Mediterranean Monk Seal',        7),
    s('California_sea_lion',      'playful',    'Clapping Sea Lion',                   7),
  ],

  whales: [
    s('Beluga_whale',             'expression', 'Smiling Beluga Whale',               10),
    s('Narwhal',                  'funny',      'Unicorn of the Sea',                   9),
    s('Humpback_whale',           'action',     'Breaching Humpback Whale',             9),
    s('Blue_whale',               'beauty',     'Largest Animal on Earth',              9),
    s('Gray_whale',               'wholesome',  'Friendly Gray Whale Approach',         8),
    s('Bowhead_whale',            'portrait',   'Arctic Bowhead Whale',                 7),
    s('Right_whale',              'portrait',   'North Atlantic Right Whale',           7),
    s('Minke_whale',              'action',     'Minke Whale Surfacing',               7),
    s('Sperm_whale',              'portrait',   'Sperm Whale Dive',                     7),
    s('Sei_whale',                'portrait',   'Sei Whale',                            6),
    s('Pygmy_sperm_whale',        'portrait',   'Pygmy Sperm Whale',                    6),
  ],

  octopuses: [
    s('Common_octopus',           'expression', 'Alien-Faced Octopus',                  9),
    s('Mimic_octopus',            'action',     'Shape-Shifting Mimic Octopus',         9),
    s('Blue-ringed_octopus',      'beauty',     'Glowing Blue-Ringed Octopus',          9),
    s('Dumbo_octopus',            'funny',      'Ear-Winged Dumbo Octopus',             9),
    s('Giant_Pacific_octopus',    'beauty',     'Giant Pacific Octopus',                8),
    s('Blanket_octopus',          'beauty',     'Flowing Blanket Octopus',              8),
    s('Wunderpus_photogenicus',   'beauty',     'Striped Wunderpus Octopus',            8),
    s('Day_octopus',              'beauty',     'Color-Shifting Day Octopus',           8),
    s('Coconut_octopus',          'funny',      'Tool-Using Coconut Octopus',           8),
    s('Atlantic_pygmy_octopus',   'portrait',   'Tiny Pygmy Octopus',                   7),
  ],

  sharks: [
    s('Whale_shark',              'beauty',     'Gentle Giant Whale Shark',            10),
    s('Nurse_shark',              'wholesome',  'Resting Nurse Shark',                  8),
    s('Hammerhead_shark',         'beauty',     'Unique Hammerhead Profile',            8),
    s('Zebra_shark',              'beauty',     'Spotted Zebra Shark',                  8),
    s('Great_white_shark',        'action',     'Great White Breach',                   8),
    s('Wobbegong',                'funny',      'Carpet-Like Wobbegong',                7),
    s('Epaulette_shark',          'funny',      'Walking Epaulette Shark',              8),
    s('Tasselled_wobbegong',      'beauty',     'Ornate Tasselled Wobbegong',           7),
    s('Shortfin_mako_shark',      'action',     'Fast Mako Shark',                      7),
    s('Tiger_shark',              'portrait',   'Striped Tiger Shark',                  7),
    s('Bamboo_shark',             'portrait',   'Small Bamboo Shark',                   6),
  ],

  // ── BIRDS ─────────────────────────────────────────────────────────────
  birds: [
    s('Budgerigar',               'expression', 'Colorful Budgie Face',                 9),
    s('Lovebird',                 'wholesome',  'Bonded Lovebird Pair',                 9),
    s('Cockatoo',                 'funny',      'Dramatic Crested Cockatoo',            9),
    s('Sun_conure',               'beauty',     'Vivid Orange Sun Conure',              9),
    s('Cockatiel',                'expression', 'Crested Cockatiel',                    8),
    s('African_grey_parrot',      'portrait',   'Wise African Grey Parrot',             8),
    s('Rainbow_lorikeet',         'beauty',     'Rainbow-Colored Lorikeet',             9),
    s('Macaw',                    'beauty',     'Scarlet Macaw',                        9),
    s('Blue-and-yellow_macaw',    'beauty',     'Blue and Yellow Macaw',                9),
    s('Hyacinth_macaw',           'beauty',     'Cobalt Blue Hyacinth Macaw',           9),
    s('Eclectus_parrot',          'beauty',     'Vivid Eclectus Parrot',                8),
    s('Alexandrine_parakeet',     'portrait',   'Large Alexandrine Parakeet',           7),
    s('Monk_parakeet',            'portrait',   'Green Monk Parakeet',                  7),
    s('Lorikeet',                 'beauty',     'Feeding Lorikeet Flock',               8),
    s('Kea_(bird)',               'funny',      'Mischievous Kea Parrot',               8),
  ],

  penguins: [
    s('Little_penguin',           'baby',       'World\'s Smallest Penguin',           10),
    s('Emperor_penguin',          'family',     'Emperor Penguin with Chick',          10),
    s('Rockhopper_penguin',       'funny',      'Spiky-Haired Rockhopper',              9),
    s('Macaroni_penguin',         'funny',      'Yellow-Crested Macaroni',              9),
    s('Gentoo_penguin',           'action',     'Racing Gentoo Penguin',                8),
    s('African_penguin',          'wholesome',  'African Penguin Pair',                 8),
    s('King_penguin',             'beauty',     'Regal King Penguin',                   8),
    s('Chinstrap_penguin',        'portrait',   'Striped-Chin Chinstrap',               7),
    s('Adélie_penguin',           'funny',      'Toddling Adélie Penguin',              8),
    s('Yellow-eyed_penguin',      'expression', 'Golden-Eyed Penguin',                  8),
    s('Snares_penguin',           'portrait',   'Crested Snares Penguin',               7),
    s('Fiordland_penguin',        'portrait',   'Forest-Dwelling Fiordland',            7),
  ],

  owls: [
    s('Barn_owl',                 'beauty',     'Heart-Faced Barn Owl',                10),
    s('Snowy_owl',                'beauty',     'Pure White Snowy Owl',                10),
    s('Burrowing_owl',            'funny',      'Long-Legged Burrowing Owl',            9),
    s('Elf_owl',                  'baby',       'World\'s Smallest Owl',                9),
    s('Northern_saw-whet_owl',    'wholesome',  'Tiny Saw-Whet Owl',                    8),
    s('Spectacled_owl',           'expression', 'Spectacled Owl',                       8),
    s('Eastern_screech-owl',      'expression', 'Tiny Screech Owl',                     8),
    s('Great_horned_owl',         'portrait',   'Great Horned Owl',                     8),
    s('Tawny_owl',                'portrait',   'Classic Tawny Owl',                    7),
    s('Short-eared_owl',          'beauty',     'Open-Country Short-Eared Owl',         7),
    s('Long-eared_owl',           'portrait',   'Long-Eared Owl',                       7),
    s('Barred_owl',               'portrait',   'Striped Barred Owl',                   7),
    s('Flammulated_owl',          'portrait',   'Tiny Flammulated Owl',                 6),
  ],

  eagles: [
    s('Harpy_eagle',              'expression', 'Terrifying Harpy Eagle',              10),
    s('Bald_eagle',               'beauty',     'Iconic American Bald Eagle',           9),
    s('Philippine_eagle',         'expression', 'Crested Philippine Eagle',             9),
    s('Golden_eagle',             'beauty',     'Soaring Golden Eagle',                 8),
    s('Wedge-tailed_eagle',       'beauty',     'Australian Wedge-Tailed Eagle',        7),
    s('Martial_eagle',            'beauty',     'Powerful Martial Eagle',               7),
    s('Crowned_eagle',            'expression', 'Crowned Eagle of Africa',              8),
    s('White-tailed_eagle',       'beauty',     'Sea Eagle in Flight',                  7),
    s("Steller's_sea_eagle",      'beauty',     "Massive Steller's Sea Eagle",          8),
    s('African_fish_eagle',       'beauty',     'African Fish Eagle Call',              7),
    s('Booted_eagle',             'portrait',   'Small Booted Eagle',                   6),
  ],

  flamingos: [
    s('Greater_flamingo',         'beauty',     'Pink Flamingo Colony',                10),
    s('American_flamingo',        'beauty',     'Vivid Red American Flamingo',          9),
    s('Lesser_flamingo',          'beauty',     'Millions of Lesser Flamingos',         9),
    s('Flamingo',                 'action',     'Flamingo Feeding Upside-Down',         8),
    s('Chilean_flamingo',         'portrait',   'Chilean Flamingo',                     7),
    s('Andean_flamingo',          'portrait',   'High-Altitude Andean Flamingo',        7),
    s("James's_flamingo",          'portrait',  "James's Flamingo",                     6),
    s('Flamingo_tongue_snail',    'beauty',     'Vivid Flamingo Tongue Snail',          6),
  ],

  puffins: [
    s('Atlantic_puffin',          'expression', 'Rainbow-Beaked Atlantic Puffin',      10),
    s('Tufted_puffin',            'funny',      'Wild-Haired Tufted Puffin',            9),
    s('Horned_puffin',            'portrait',   'Horned Puffin Portrait',               8),
    s('Little_auk',               'funny',      'Tiny Little Auk',                      7),
    s('Common_murre',             'portrait',   'Cliff-Nesting Murre',                  6),
    s('Razorbill',                'portrait',   'Razorbill Seabird',                    6),
    s('Pigeon_guillemot',         'beauty',     'Red-Footed Pigeon Guillemot',          7),
    s('Rhinoceros_auklet',        'portrait',   'Rhino-Horned Seabird',                 7),
  ],

  toucans: [
    s('Toco_toucan',              'beauty',     'Iconic Toco Toucan',                  10),
    s('Keel-billed_toucan',       'beauty',     'Rainbow-Billed Keel Toucan',           9),
    s('Toucanet',                 'beauty',     'Emerald Toucanet',                     8),
    s('Aracari',                  'beauty',     'Colorful Aracari',                     8),
    s('Curl-crested_aracari',     'funny',      'Curly-Headed Aracari',                 8),
    s('Channel-billed_toucan',    'portrait',   'Large Channel-Billed Toucan',          7),
    s('Toucan',                   'portrait',   'Toucan Overview',                      7),
  ],

  peacocks: [
    s('Indian_peafowl',           'beauty',     'Full Peacock Fan Display',            10),
    s('Peacock',                  'beauty',     'Peacock Feather Eye Close-Up',         9),
    s('Green_peafowl',            'beauty',     'Emerald Green Peafowl',                9),
    s('Congo_peafowl',            'beauty',     'African Congo Peafowl',                7),
    s('Pavo_(genus)',             'beauty',     'Pavo Peacock Genus',                   7),
    s('Peafowl',                  'action',     'Peafowl Species Overview',             7),
  ],

  'birds-of-paradise': [
    s('Superb_bird-of-paradise',  'beauty',     'Alien Smiley Face Display',           10),
    s('King_bird-of-paradise',    'beauty',     'Stunning King BOP',                   10),
    s('Twelve-wired_bird-of-paradise','beauty', 'Twelve-Wired BOP',                     9),
    s('Raggiana_bird-of-paradise','beauty',     'Raggiana BOP Display',                 9),
    s('Greater_bird-of-paradise', 'beauty',     'Greater BOP Plumes',                   8),
    s('Magnificent_bird-of-paradise','beauty',  'Magnificent BOP',                      9),
    s('Lesser_bird-of-paradise',  'beauty',     'Lesser BOP',                           8),
    s('Paradisaea',               'beauty',     'Paradisaea Genus Display',             8),
    s('Bird-of-paradise',         'portrait',   'BOP Overview',                         7),
  ],

  geese: [
    s('Gosling_(bird)',           'baby',       'Fluffy Newborn Gosling',              10),
    s('Canada_goose',             'funny',      'Determined Canada Goose',              8),
    s('Snow_goose',               'beauty',     'Snow Goose Flock',                     7),
    s('Greylag_goose',            'portrait',   'Classic Greylag Goose',                6),
    s('Barnacle_goose',           'portrait',   'Black-and-White Barnacle Goose',       7),
    s('Egyptian_goose',           'beauty',     'Colorful Egyptian Goose',              7),
    s('Chinese_goose',            'expression', 'Long-Necked Chinese Goose',            7),
    s('Toulouse_goose',           'portrait',   'Heavy Toulouse Goose',                 6),
    s('Cackling_goose',           'portrait',   'Miniature Cackling Goose',             6),
    s('Ross\'s_goose',             'portrait',   'Tiny Ross\'s Goose',                   6),
  ],

  shoebill: [
    s('Shoebill',                 'expression', 'Prehistoric Shoebill Stare',          10),
    s('Balaeniceps_rex',          'portrait',   'Shoebill Full Body',                   9),
    s('Ground_hornbill',          'expression', 'Southern Ground Hornbill',             7),
    s('Marabou_stork',            'funny',      'Hunched Marabou Stork',                7),
    s('Saddle-billed_stork',      'beauty',     'Saddle-Billed Stork',                  7),
    s('Jabiru',                   'portrait',   'Massive Jabiru Stork',                 6),
  ],

  // ── WILD ──────────────────────────────────────────────────────────────
  foxes: [
    s('Arctic_fox',               'baby',       'White Arctic Fox Cubs',               10),
    s('Red_fox',                  'beauty',     'Gorgeous Red Fox',                     9),
    s('Tibetan_fox',              'expression', 'Deadpan Tibetan Fox Face',             9),
    s("Blanford's_fox",            'expression', "Big-Eared Blanford's Fox",             8),
    s('Kit_fox',                  'baby',       'Tiny Kit Fox',                         8),
    s('Swift_fox',                'portrait',   'Small Plains Swift Fox',               7),
    s('Gray_fox',                 'portrait',   'Gray Fox Portrait',                    7),
    s('Corsac_fox',               'portrait',   'Central Asian Corsac Fox',             7),
    s('Island_fox',               'portrait',   'Tiny Channel Island Fox',              7),
  ],

  'fennec-fox': [
    s('Fennec_fox',               'expression', 'Giant-Eared Fennec Fox',              10),
    s('Fennec',                   'baby',       'Baby Fennec Fox',                      9),
    s('Vulpes_zerda',             'portrait',   'Fennec Scientific Portrait',           8),
    s("Rüppell's_fox",             'portrait',   "Desert Rüppell's Fox",                 7),
    s('Sand_cat',                 'expression', 'Big-Eared Sand Cat',                   7),
    s('Pale_fox',                 'portrait',   'Pale Saharan Fox',                     6),
  ],

  wolves: [
    s('Arctic_wolf',              'beauty',     'Pure White Arctic Wolf',               9),
    s('Gray_wolf',                'beauty',     'Majestic Gray Wolf',                   9),
    s('Ethiopian_wolf',           'portrait',   'Rare Ethiopian Wolf',                  8),
    s('Maned_wolf',               'funny',      'Long-Legged Maned Wolf',               8),
    s('African_wild_dog',         'beauty',     'Painted African Wild Dog',             8),
    s('Dhole',                    'portrait',   'Asian Dhole',                          7),
    s('Mexican_wolf',             'portrait',   'Endangered Mexican Wolf',              7),
    s('Red_wolf',                 'portrait',   'Rare Red Wolf',                        7),
    s('Bush_dog',                 'portrait',   'Small Bush Dog',                       6),
  ],

  bears: [
    s('Polar_bear',               'baby',       'Polar Bear Cubs Playing',             10),
    s('Brown_bear',               'baby',       'Brown Bear Cubs',                      9),
    s('Sun_bear',                 'expression', 'Sun Bear Long Tongue',                 9),
    s('Kermode_bear',             'beauty',     'Rare White Spirit Bear',               9),
    s('Grizzly_bear',             'action',     'Grizzly Catching Salmon',              8),
    s('Spectacled_bear',          'portrait',   'Spectacled Bear',                      7),
    s('American_black_bear',      'wholesome',  'Black Bear Portrait',                  7),
    s('Asiatic_black_bear',       'portrait',   'Moon Bear',                            7),
    s('Sloth_bear',               'funny',      'Shaggy Sloth Bear',                    7),
    s('Kodiak_bear',              'portrait',   'Massive Kodiak Bear',                  7),
  ],

  deer: [
    s('White-tailed_deer',        'baby',       'Spotted Fawn in Grass',               10),
    s('Roe_deer',                 'baby',       'Baby Roe Deer Fawn',                    9),
    s('Pudu',                     'baby',       'World\'s Smallest Deer',                9),
    s('Water_deer',               'expression', 'Fanged Water Deer',                     8),
    s('Red_deer',                 'beauty',     'Majestic Red Stag in Rut',              8),
    s('Sika_deer',                'beauty',     'Spotted Sika Deer',                     8),
    s('Fallow_deer',              'beauty',     'Dappled Fallow Deer',                   7),
    s('Moose',                    'funny',      'Enormous Moose Up-Close',               8),
    s('Elk',                      'beauty',     'Bull Elk in Rut',                       8),
    s('Muntjac',                  'portrait',   'Tiny Muntjac Deer',                     7),
    s('Reindeer',                 'portrait',   'Reindeer Portrait',                     8),
    s('Axis_deer',                'beauty',     'Spotted Chital Deer',                   7),
  ],

  otters: [
    s('Sea_otter',                'wholesome',  'Sea Otters Holding Hands',             10),
    s('North_American_river_otter','playful',   'Playful River Otter',                   9),
    s('Giant_otter',              'family',     'Giant Otter Family',                    9),
    s('Asian_small-clawed_otter', 'wholesome',  'Clapping Small-Clawed Otter',           9),
    s('Smooth-coated_otter',      'family',     'Family of Smooth Otters',               8),
    s('European_otter',           'portrait',   'European Otter Portrait',               8),
    s('Hairy-nosed_otter',        'portrait',   'Rare Hairy-Nosed Otter',               7),
    s('Neotropical_otter',        'playful',    'Neotropical River Otter',               7),
    s('Marine_otter',             'portrait',   'Marine Otter Chile',                    6),
  ],

  raccoons: [
    s('Raccoon',                  'funny',      'Bandit-Masked Raccoon',                 9),
    s('Raccoon_dog',              'portrait',   'Fluffy Raccoon Dog',                    8),
    s('White-nosed_coati',        'portrait',   'Long-Nosed Coati',                      7),
    s('Ring-tailed_coati',        'portrait',   'Striped-Tail Coati',                    7),
    s('Crab-eating_raccoon',      'portrait',   'South American Raccoon',               6),
    s('Cacomistle',               'portrait',   'Ring-Tailed Cacomistle',               7),
    s('Ringtail_(animal)',        'portrait',   'Ringtail Mammal',                      7),
    s('Kinkajou',                 'portrait',   'Nocturnal Kinkajou',                    7),
    s('Olingo',                   'portrait',   'Bushy-Tailed Olingo',                   6),
  ],

  squirrels: [
    s('Red_squirrel',             'beauty',     'Vivid Red Squirrel',                    9),
    s('Eastern_gray_squirrel',    'funny',      'Cheeky Gray Squirrel',                  8),
    s("Prevost's_squirrel",        'beauty',     "Tricolor Prevost's Squirrel",           9),
    s('Indian_giant_squirrel',    'beauty',     'Colorful Giant Malabar Squirrel',       9),
    s('Flying_squirrel',          'action',     'Gliding Flying Squirrel',               9),
    s("Finlayson's_squirrel",      'beauty',     "Finlayson's Variable Squirrel",        8),
    s("Abert's_squirrel",          'portrait',   "Tufted-Ear Abert's Squirrel",          7),
    s('Fox_squirrel',             'portrait',   'Fox Squirrel',                          7),
    s('Douglas_squirrel',         'portrait',   'Douglas Squirrel',                      7),
    s('Chipmunk',                 'funny',      'Cheek-Stuffed Chipmunk',               9),
    s('Ground_squirrel',          'funny',      'Alert Ground Squirrel',                 7),
    s('Thirteen-lined_ground_squirrel','portrait','Striped Ground Squirrel',            6),
  ],

  servals: [
    s('Serval',                   'beauty',     'Striking Spotted Serval',              10),
    s('Caracal',                  'beauty',     'Tufted-Ear Caracal',                   9),
    s('Ocelot',                   'beauty',     'Spotted Ocelot',                        8),
    s('Margay',                   'portrait',   'Large-Eyed Margay Cat',                8),
    s('African_wildcat',          'portrait',   'African Wildcat',                       6),
    s("Geoffroy's_cat",            'portrait',   "Spotted Geoffroy's Cat",               7),
    s('Pampas_cat',               'portrait',   'Pampas Cat',                            6),
    s('Sand_cat',                 'expression', 'Desert Sand Cat',                       7),
  ],

  // ── EXOTIC ────────────────────────────────────────────────────────────
  capybaras: [
    s('Capybara',                 'funny',      'Chill Capybara Emperor',               10),
    s('Hydrochoerus_hydrochaeris','family',     'Capybara Family in Water',             9),
    s('Lesser_capybara',          'portrait',   'Lesser Capybara',                      7),
    s('Patagonian_mara',          'portrait',   'Long-Legged Mara',                     7),
    s('Capybara_swimming',        'action',     'Capybara Swimming',                    8),
    s('Nutria',                   'portrait',   'Giant Nutria',                          6),
    s('Coypu',                    'portrait',   'Coypu River Rat',                       6),
  ],

  sloths: [
    s('Three-toed_sloth',         'baby',       'Baby Sloth Clinging to Branch',       10),
    s('Two-toed_sloth',           'wholesome',  'Peaceful Two-Toed Sloth',              8),
    s("Hoffmann's_two-toed_sloth",'portrait',   "Hoffmann's Sloth",                     7),
    s('Pygmy_three-toed_sloth',   'portrait',   'Tiny Pygmy Island Sloth',              7),
    s('Brown-throated_sloth',     'portrait',   'Brown-Throated Sloth',                 7),
    s('Maned_sloth',              'portrait',   'Endangered Maned Sloth',               7),
    s('Sloth',                    'funny',      'Upside-Down Sloth Smile',              8),
  ],

  koalas: [
    s('Koala',                    'wholesome',  'Koala Hugging Tree with Joey',        10),
    s('Phascolarctos_cinereus',   'portrait',   'Koala Scientific Portrait',            8),
    s('Common_wombat',            'portrait',   'Chunky Wombat',                        7),
    s('Quokka',                   'wholesome',  'Smiling Quokka',                      10),
    s('Sugar_glider',             'baby',       'Sugar Glider in Hand',                 8),
    s('Brushtail_possum',         'portrait',   'Fluffy Brushtail Possum',              7),
    s('Ringtail_possum',          'portrait',   'Ring-Tailed Possum',                   6),
    s('Numbat',                   'beauty',     'Striped Numbat',                        7),
  ],

  pandas: [
    s('Giant_panda',              'funny',      'Panda Rolling and Eating Bamboo',     10),
    s('Panda_cub',                'baby',       'Tiny Giant Panda Cub',                10),
    s('Ailuropoda_melanoleuca',   'portrait',   'Giant Panda Eating',                   8),
    s('Qinling_panda',            'portrait',   'Brown Qinling Panda',                  8),
    s('Conservation_of_giant_pandas','wholesome','Panda Conservation',                  7),
    s('Giant_panda_cub',          'baby',       'Newborn Pink Panda Cub',               9),
    s('Ailurarctos',              'portrait',   'Prehistoric Panda',                    5),
  ],

  'red-pandas': [
    s('Red_panda',                'beauty',     'Stunning Red Panda on Branch',        10),
    s('Ailurus_fulgens',          'portrait',   'Red Panda Scientific Portrait',        8),
    s('Ailurus_styani',           'portrait',   'Chinese Red Panda',                    7),
    s('Red_panda_eating',         'wholesome',  'Red Panda Munching Bamboo',            8),
    s('Himalayan_red_panda',      'beauty',     'Himalayan Red Panda',                  8),
    s('Red_panda_conservation',   'wholesome',  'Red Panda Conservation Work',          7),
  ],

  meerkats: [
    s('Meerkat',                  'funny',      'Sentinel Meerkat Standing Watch',     10),
    s('Suricata_suricatta',       'portrait',   'Meerkat Scientific Portrait',          8),
    s('Dwarf_mongoose',           'portrait',   'Tiny Dwarf Mongoose',                  7),
    s('Yellow_mongoose',          'portrait',   'Yellow Mongoose',                      6),
    s('Banded_mongoose',          'portrait',   'Banded Mongoose Group',                6),
    s('Slender_mongoose',         'portrait',   'Slender Mongoose',                     6),
  ],

  alpacas: [
    s('Alpaca',                   'funny',      'Curious Alpaca Close-Up',              9),
    s('Vicugna_pacos',            'portrait',   'Alpaca Scientific Portrait',           8),
    s('Huacaya_alpaca',           'portrait',   'Fluffy Huacaya Alpaca',                8),
    s('Suri_alpaca',              'beauty',     'Silky Long-Haired Suri Alpaca',        8),
    s('Llama',                    'funny',      'Haughty Llama',                        8),
    s('Guanaco',                  'portrait',   'Wild Guanaco',                         6),
    s('Vicuna',                   'portrait',   'Graceful Vicuña',                      7),
  ],

  quokkas: [
    s('Quokka',                   'wholesome',  'Happiest Animal — Quokka',            10),
    s('Setonix_brachyurus',       'portrait',   'Quokka Scientific Portrait',           8),
    s('Wallaby',                  'portrait',   'Small Rock Wallaby',                   6),
    s('Pademelon',                'portrait',   'Pademelon Marsupial',                  6),
    s("Bennett's_wallaby",         'portrait',  "Bennett's Wallaby",                    7),
    s('Agile_wallaby',            'portrait',   'Agile Wallaby',                        6),
  ],

  'sugar-gliders': [
    s('Sugar_glider',             'baby',       'Tiny Sugar Glider in Hand',            9),
    s('Petaurus_breviceps',       'portrait',   'Sugar Glider Scientific Portrait',     8),
    s('Squirrel_glider',          'portrait',   'Squirrel Glider',                      7),
    s('Feathertail_glider',       'baby',       'World\'s Smallest Glider',             8),
    s('Yellow-bellied_glider',    'portrait',   'Yellow-Bellied Glider',                7),
    s('Mahogany_glider',          'portrait',   'Rare Mahogany Glider',                 6),
    s('Flying_squirrel',          'action',     'Gliding Flying Squirrel',              7),
  ],

  lemurs: [
    s('Ring-tailed_lemur',        'funny',      'Striped-Tail Ring-Tailed Lemur',       9),
    s('Sifaka',                   'action',     'Dancing Sifaka Lemur',                 9),
    s('Red-ruffed_lemur',         'beauty',     'Vivid Red Ruffed Lemur',               8),
    s('Blue-eyed_black_lemur',    'expression', 'Blue-Eyed Black Lemur',               9),
    s('Coquerel\'s_sifaka',        'action',     'Bouncing Coquerel\'s Sifaka',          8),
    s('Mouse_lemur',              'baby',       'Tiny Mouse Lemur',                     8),
    s('Black-and-white_ruffed_lemur','portrait','Black & White Ruffed Lemur',          7),
    s('Indri',                    'portrait',   'Largest Living Lemur Indri',           7),
    s('Brown_lemur',              'portrait',   'Brown Lemur',                          6),
    s('Lemur',                    'portrait',   'Lemur Overview',                       6),
  ],

  kinkajous: [
    s('Kinkajou',                 'portrait',   'Nocturnal Kinkajou',                   7),
    s('Potos_flavus',             'portrait',   'Kinkajou Scientific Portrait',         7),
    s('Binturong',                'expression', 'Bear-Cat Binturong',                   8),
    s('Olingo',                   'portrait',   'Bushy-Tailed Olingo',                  6),
    s('Common_palm_civet',        'portrait',   'Palm Civet',                           6),
    s('Ringtail_(animal)',        'portrait',   'Ringtail Mammal',                      6),
  ],

  'tree-kangaroos': [
    s("Goodfellow's_tree_kangaroo",'portrait',  "Goodfellow's Tree Kangaroo",           8),
    s('Tree_kangaroo',            'portrait',   'Tree Kangaroo Overview',               7),
    s("Lumholtz's_tree_kangaroo", 'portrait',   'Australian Tree Kangaroo',             7),
    s("Matschie's_tree_kangaroo", 'portrait',   'Papua Tree Kangaroo',                  7),
    s("Doria's_tree_kangaroo",    'portrait',   "Doria's Tree Kangaroo",                6),
    s('Rock-wallaby',             'portrait',   'Rock Wallaby',                         6),
    s('Quokka',                   'wholesome',  'Smiling Quokka',                       7),
    s('Pademelon',                'portrait',   'Pademelon',                            6),
  ],

  // ── REPTILES ──────────────────────────────────────────────────────────
  turtles: [
    s('Sea_turtle',               'beauty',     'Sea Turtle Gliding Underwater',        9),
    s('Hawksbill_sea_turtle',     'beauty',     'Beautiful Hawksbill Turtle',           8),
    s('Green_sea_turtle',         'beauty',     'Green Sea Turtle in Ocean',            8),
    s('Galapagos_tortoise',       'portrait',   'Ancient Galápagos Tortoise',           8),
    s('Pancake_tortoise',         'funny',      'Flat Pancake Tortoise',                8),
    s('Painted_turtle',           'beauty',     'Colorful Painted Turtle',              7),
    s('Red-eared_slider',         'portrait',   'Red-Eared Slider',                     7),
    s('Hermann\'s_tortoise',       'portrait',   'Hermann\'s Tortoise',                  7),
    s('Russian_tortoise',         'portrait',   'Russian Tortoise',                     6),
    s('Aldabra_giant_tortoise',   'portrait',   'Aldabra Giant Tortoise',               7),
    s('Loggerhead_sea_turtle',    'portrait',   'Loggerhead Sea Turtle',                7),
    s('Leatherback_sea_turtle',   'portrait',   'Massive Leatherback Turtle',           7),
  ],

  lizards: [
    s('Crested_gecko',            'expression', 'Smiling Crested Gecko',                9),
    s('Leopard_gecko',            'expression', 'Grinning Leopard Gecko',               9),
    s('Blue-tongued_skink',       'funny',      'Blue Tongue Shock Display',            8),
    s('Frilled-neck_lizard',      'funny',      'Frilled Neck Display',                 9),
    s('Satanic_leaf-tailed_gecko','expression', 'Leaf-Mimicking Gecko',                 9),
    s('Blue_iguana',              'beauty',     'Electric Blue Grand Cayman Iguana',    8),
    s('Bearded_dragon',           'portrait',   'Bearded Dragon Portrait',              8),
    s('Tokay_gecko',              'beauty',     'Spotted Tokay Gecko',                  7),
    s('Peacock_day_gecko',        'beauty',     'Electric Blue Peacock Gecko',          8),
    s('Day_gecko',                'beauty',     'Vivid Green Day Gecko',                8),
    s('Green_anole',              'beauty',     'Dewlap-Displaying Green Anole',        7),
    s('Green_iguana',             'portrait',   'Green Iguana',                         7),
  ],

  chameleons: [
    s('Panther_chameleon',        'beauty',     'Vivid Rainbow Panther Chameleon',     10),
    s('Veiled_chameleon',         'expression', 'Independent-Eye Veiled Chameleon',     9),
    s('Jackson\'s_chameleon',      'funny',      'Three-Horned Jackson\'s Chameleon',   9),
    s('Brookesia_micra',          'funny',      'World\'s Tiniest Chameleon',           9),
    s('Pygmy_chameleon',          'funny',      'Leaf Pygmy Chameleon',                 8),
    s("Parson's_chameleon",        'expression', "Giant Parson's Chameleon",            8),
    s('Carpet_chameleon',         'beauty',     'Colorful Carpet Chameleon',            8),
    s("Meller's_chameleon",        'portrait',   "Giant Meller's Chameleon",             7),
    s('Calumma_brevicorne',       'portrait',   'Short-Horned Chameleon',               6),
    s('Chameleon',                'action',     'Chameleon Changing Color',             8),
  ],

  snakes: [
    s('Emerald_tree_boa',         'beauty',     'Vivid Green Emerald Tree Boa',         9),
    s('Rainbow_boa',              'beauty',     'Iridescent Rainbow Boa',               9),
    s('Green_tree_python',        'beauty',     'Coiled Green Tree Python',             9),
    s('Hognose_snake',            'funny',      'Dramatic Playing-Dead Hognose',        8),
    s('Blue_Malaysian_coral_snake','beauty',    'Vivid Blue Coral Snake',               8),
    s('Mandarin_rat_snake',       'beauty',     'Vivid Mandarin Rat Snake',             8),
    s('King_cobra',               'beauty',     'Majestic King Cobra Hood',             8),
    s('Ball_python',              'wholesome',  'Curled Ball Python',                   8),
    s('Milk_snake',               'beauty',     'Banded Milk Snake',                    7),
    s('Corn_snake',               'portrait',   'Colorful Corn Snake',                  7),
    s('Boa_constrictor',          'portrait',   'Boa Constrictor',                      7),
    s('San_Francisco_garter_snake','beauty',    'Stunning Garter Snake',                7),
  ],

  // ── AMPHIBIANS ────────────────────────────────────────────────────────
  axolotls: [
    s('Axolotl',                  'expression', 'Perpetually Smiling Axolotl',         10),
    s('Ambystoma_mexicanum',      'portrait',   'Axolotl Scientific Portrait',          8),
    s('Tiger_salamander',         'beauty',     'Tiger Salamander',                     7),
    s('Marbled_salamander',       'beauty',     'Striped Marbled Salamander',           7),
    s('Mudpuppy',                 'portrait',   'Mudpuppy Salamander',                  6),
    s('California_tiger_salamander','portrait', 'California Tiger Salamander',          6),
    s('Olm',                      'expression', 'Cave-Dwelling Olm',                    7),
    s('Hellbender',               'funny',      'Massive Hellbender Salamander',        7),
    s('Spotted_salamander',       'beauty',     'Spotted Salamander',                   7),
  ],

  frogs: [
    s('Red-eyed_tree_frog',       'expression', 'Iconic Red-Eyed Tree Frog',           10),
    s('Poison_dart_frog',         'beauty',     'Vivid Poison Dart Frog',              10),
    s('Strawberry_poison-dart_frog','beauty',   'Strawberry Poison Dart Frog',          9),
    s('Glass_frog',               'funny',      'See-Through Glass Frog',               9),
    s('Dumpy_tree_frog',          'expression', 'Sleepy White\'s Tree Frog',            9),
    s('Pacman_frog',              'funny',      'Round Pacman Frog',                    8),
    s('Tomato_frog',              'beauty',     'Bright Orange Tomato Frog',            8),
    s('Vietnamese_mossy_frog',    'beauty',     'Rock-Mimicking Mossy Frog',            8),
    s('Golden_poison_frog',       'beauty',     'Golden Poison Dart Frog',              8),
    s('Blue_poison_dart_frog',    'beauty',     'Electric Blue Dart Frog',              8),
    s('Amazon_milk_frog',         'portrait',   'Amazon Milk Frog',                     7),
    s('African_bullfrog',         'portrait',   'African Bullfrog',                     7),
    s('Flying_frog',              'action',     'Gliding Wallace\'s Flying Frog',       7),
  ],

  // ── BABY ANIMALS ──────────────────────────────────────────────────────
  'baby-animals': [
    s('Puppy',                    'baby',       'Tiny Puppy',                           10),
    s('Kitten',                   'baby',       'Tiny Kitten',                          10),
    s('Duckling',                 'baby',       'Fluffy Duckling',                      10),
    s('Lamb_(animal)',            'baby',       'Baby Lamb',                             9),
    s('Foal',                     'baby',       'Newborn Foal',                          9),
    s('Calf',                     'baby',       'Baby Calf',                             9),
    s('Gosling_(bird)',           'baby',       'Baby Gosling',                          9),
    s('Harp_seal',                'baby',       'White Harp Seal Pup',                  9),
    s('Polar_bear',               'baby',       'Polar Bear Cub',                        9),
    s('Red_fox',                  'baby',       'Fox Kit',                               8),
    s('Brown_bear',               'baby',       'Brown Bear Cub',                        8),
    s('Three-toed_sloth',         'baby',       'Baby Sloth',                            9),
  ],

  // ── LEGENDARY ─────────────────────────────────────────────────────────
  kakapo: [
    s('Kakapo',                   'expression', 'Legendary Kakapo Parrot',              10),
    s('Strigops',                 'portrait',   'Kakapo Scientific Name',               8),
    s('Kea_(bird)',               'funny',      'Mischievous Kea Parrot',               8),
    s('Kaka_(bird)',              'portrait',   'New Zealand Kaka',                     7),
    s('Kakapo_recovery',          'wholesome',  'Kakapo Recovery Program',              7),
  ],

  'saiga-antelope': [
    s('Saiga_antelope',           'expression', 'Prehistoric Saiga Nose',               10),
    s('Saiga_tatarica',           'portrait',   'Saiga Scientific Portrait',            8),
    s('Tibetan_antelope',         'portrait',   'Tibetan Chiru Antelope',               7),
    s('Springbok',                'action',     'Pronking Springbok',                    7),
    s('Blackbuck',                'beauty',     'Spiraled-Horn Blackbuck',              7),
  ],

  'aye-aye': [
    s('Aye-aye',                  'expression', 'Mysterious Big-Eyed Aye-Aye',          9),
    s('Daubentonia_madagascariensis','portrait','Aye-Aye Scientific Portrait',          8),
    s('Tarsier',                  'expression', 'Giant-Eyed Tarsier',                   9),
    s('Slow_loris',               'expression', 'Big-Eyed Slow Loris',                  8),
    s('Potto',                    'portrait',   'Nocturnal Potto',                       6),
  ],

  okapi: [
    s('Okapi',                    'beauty',     'Elusive Okapi — Forest Giraffe',        9),
    s('Okapia_johnstoni',         'portrait',   'Okapi Scientific Portrait',            8),
    s('Giraffe',                  'beauty',     'Tall Reticulated Giraffe',             7),
    s('Gerenuk',                  'funny',      'Long-Necked Standing Gerenuk',         7),
  ],

  pangolin: [
    s('Pangolin',                 'expression', 'Armored Pangolin Rolled Up',           10),
    s('Sunda_pangolin',           'portrait',   'Sunda Pangolin',                        8),
    s('Chinese_pangolin',         'portrait',   'Chinese Pangolin',                      7),
    s('Ground_pangolin',          'portrait',   'Ground Pangolin Walking',              7),
    s('Indian_pangolin',          'portrait',   'Indian Pangolin',                      7),
    s('Philippine_pangolin',      'portrait',   'Philippine Pangolin',                  6),
    s('Armadillo',                'funny',      'Rolling Nine-Banded Armadillo',         7),
    s('Aardvark',                 'expression', 'Long-Nosed Aardvark',                  7),
  ],

  vaquita: [
    s('Vaquita',                  'portrait',   'World\'s Rarest Porpoise',              8),
    s('Phocoena_sinus',           'portrait',   'Vaquita Scientific Portrait',          7),
    s('Harbour_porpoise',         'portrait',   'Harbour Porpoise',                     6),
    s('Finless_porpoise',         'portrait',   'Finless Porpoise',                     6),
    s('Yangtze_finless_porpoise', 'portrait',   'Yangtze Porpoise',                     6),
  ],
};