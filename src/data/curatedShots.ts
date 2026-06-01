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
// Curated shot libraries — one entry per species ID
// Ordered from highest to lowest expected emotional impact
// ---------------------------------------------------------------------------

export const CURATED_SHOTS: Record<string, CuratedShot[]> = {

  // ── PETS ──────────────────────────────────────────────────────────────
  dogs: [
    s('Puppy',                    'baby',       'Adorable Puppy Pile',               10),
    s('Pembroke_Welsh_Corgi',     'funny',      'Iconic Corgi Portrait',             10),
    s('Pomeranian_(dog)',         'expression', 'Fluffy Pomeranian Face',             9),
    s('Shiba_Inu',                'funny',      'Classic Shiba Inu',                  9),
    s('Samoyed_(dog)',            'portrait',   'Smiling Samoyed',                    9),
    s('Siberian_Husky',           'beauty',     'Striking Husky Portrait',            8),
    s('Golden_Retriever',         'wholesome',  'Golden Retriever Smile',             8),
    s('French_Bulldog',           'expression', 'Bat-Eared French Bulldog',           8),
    s('Dachshund',                'funny',      'Sausage Dog Close-Up',               8),
    s('Bernese_Mountain_Dog',     'portrait',   'Bernese Mountain Dog',               8),
    s('Australian_Shepherd',      'beauty',     'Merle Australian Shepherd',          8),
    s('Border_Collie',            'portrait',   'Focused Border Collie',              7),
    s('Labrador_Retriever',       'portrait',   'Labrador Portrait',                  7),
    s('Beagle',                   'portrait',   'Classic Beagle',                     7),
  ],

  cats: [
    s('Kitten',                   'baby',       'Tiny Kitten Bundle',                10),
    s('Scottish_Fold',            'expression', 'Owl-Faced Scottish Fold',           10),
    s('Persian_cat',              'expression', 'Squished Persian Face',              9),
    s('Maine_Coon',               'portrait',   'Majestic Maine Coon',                9),
    s('Ragdoll_cat',              'wholesome',  'Floppy Ragdoll Cat',                 9),
    s('Bengal_cat',               'beauty',     'Wild Bengal Rosettes',               8),
    s('Norwegian_Forest_cat',     'beauty',     'Fluffy Norwegian Forest Cat',        8),
    s('Siamese_cat',              'portrait',   'Classic Siamese',                    8),
    s('Russian_Blue',             'beauty',     'Silver-Grey Russian Blue',           8),
    s('Turkish_Angora',           'portrait',   'Turkish Angora',                     7),
    s('Birman',                   'portrait',   'Sacred Birman Cat',                  7),
  ],

  rabbits: [
    s('Holland_Lop',              'expression', 'Floppy-Eared Holland Lop',          10),
    s('Angora_rabbit',            'funny',      'Living Fluff Ball Angora',           9),
    s('Lionhead_rabbit',          'funny',      'Maned Lionhead Rabbit',              9),
    s('Flemish_Giant_rabbit',     'funny',      'Enormous Flemish Giant',             9),
    s('Netherland_Dwarf_rabbit',  'baby',       'Teacup Dwarf Rabbit',                9),
    s('Domestic_rabbit',          'portrait',   'Domestic Rabbit',                    8),
    s('Rex_rabbit',               'portrait',   'Velvet Rex Rabbit',                  7),
  ],

  hamsters: [
    s('Roborovski_hamster',       'baby',       'Tiny Roborovski Hamster',            9),
    s('Syrian_hamster',           'expression', 'Chubby-Cheeked Hamster',             8),
    s('Winter_white_dwarf_hamster','portrait',  'Winter White Hamster',               8),
    s('Dwarf_hamster',            'portrait',   'Dwarf Hamster',                      7),
    s('Chinese_hamster',          'portrait',   'Chinese Hamster',                    7),
  ],

  hedgehogs: [
    s('African_pygmy_hedgehog',   'baby',       'Baby Pygmy Hedgehog',                9),
    s('Hedgehog',                 'expression', 'Hedgehog Nose Close-Up',             8),
    s('European_hedgehog',        'portrait',   'European Hedgehog',                  7),
  ],

  ferrets: [
    s('Ferret',                   'funny',      'War-Dancing Ferret',                 9),
  ],

  'guinea-pigs': [
    s('Abyssinian_guinea_pig',    'funny',      'Crazy-Haired Abyssinian',            9),
    s('Guinea_pig',               'portrait',   'Round Guinea Pig',                   8),
  ],

  // ── FARM ──────────────────────────────────────────────────────────────
  horses: [
    s('Foal',                     'baby',       'Wobbly Newborn Foal',               10),
    s('Shetland_pony',            'funny',      'Tiny Shetland Pony',                 9),
    s('Friesian_horse',           'beauty',     'Majestic Black Friesian',            9),
    s('Arabian_horse',            'beauty',     'Elegant Arabian Horse',              9),
    s('Andalusian_horse',         'beauty',     'Graceful Andalusian',                8),
    s('Horse',                    'portrait',   'Horse Portrait',                     7),
    s('Thoroughbred',             'action',     'Thoroughbred at Gallop',             7),
  ],

  cows: [
    s('Calf',                     'baby',       'Newborn Calf with Big Eyes',        10),
    s('Highland_cattle',          'funny',      'Shaggy Long-Horned Highland',        9),
    s('Belted_Galloway',          'funny',      'Oreo-Belt Galloway Cow',             8),
    s('Jersey_cattle',            'wholesome',  'Sweet Jersey Cow',                   8),
    s('Hereford_cattle',          'portrait',   'Hereford Cattle',                    7),
  ],

  pigs: [
    s('Miniature_pig',            'funny',      'Micro Pig Close-Up',                10),
    s('Kunekune',                 'funny',      'Hairy Kunekune Pig',                  8),
    s('Pig',                      'standard',   'Domestic Pig',                        6),
  ],

  sheep: [
    s('Lamb_(animal)',            'baby',       'Fluffy Baby Lamb',                  10),
    s('Valais_Blacknose_sheep',   'expression', 'World\'s Cutest Sheep Face',         10),
    s('Merino',                   'funny',      'Ultra-Fluffy Merino Wool',            8),
    s('Texel_(sheep)',            'portrait',   'Texel Sheep',                         7),
  ],

  goats: [
    s('Nigerian_Dwarf_goat',      'baby',       'Miniature Nigerian Goat Kid',         9),
    s('Pygmy_goat',               'funny',      'Tiny Mischievous Pygmy Goat',         9),
    s('Domestic_goat',            'funny',      'Cheeky Goat Expression',              8),
    s('Nubian_goat',              'portrait',   'Long-Eared Nubian Goat',              7),
  ],

  chickens: [
    s('Silkie',                   'funny',      'Cloud Silkie Chicken',                9),
    s('Orpington_chicken',        'portrait',   'Fluffy Orpington',                    7),
    s('Plymouth_Rock_chicken',    'portrait',   'Plymouth Rock Chicken',               7),
  ],

  ducks: [
    s('Duckling',                 'baby',       'Tiny Yellow Duckling',               10),
    s('Call_duck',                'funny',      'Miniature Call Duck',                 9),
    s('Indian_Runner_duck',       'funny',      'Upright Running Duck',                9),
    s('Pekin_duck',               'wholesome',  'Fluffy White Pekin',                  7),
    s('Mallard',                  'portrait',   'Mallard Duck',                        7),
    s('Cayuga_duck',              'beauty',     'Iridescent Cayuga Duck',              7),
  ],

  // ── OCEAN ─────────────────────────────────────────────────────────────
  dolphins: [
    s('Bottlenose_dolphin',       'playful',    'Leaping Bottlenose Dolphin',          9),
    s('Orca',                     'beauty',     'Magnificent Black-and-White Orca',    9),
    s('Spinner_dolphin',          'action',     'Aerial-Spinning Dolphin',             8),
    s('Common_dolphin',           'portrait',   'Common Dolphin',                      8),
  ],

  seals: [
    s('Harp_seal',                'baby',       'Baby White Harp Seal Pup',           10),
    s('Harbor_seal',              'expression', 'Puppy-Eyed Harbor Seal',              9),
    s('Elephant_seal',            'funny',      'Big-Nosed Elephant Seal',             8),
    s('Weddell_seal',             'wholesome',  'Resting Weddell Seal',                8),
  ],

  whales: [
    s('Beluga_whale',             'expression', 'Smiling Beluga Whale',               10),
    s('Narwhal',                  'funny',      'Unicorn of the Sea',                   9),
    s('Humpback_whale',           'action',     'Breaching Humpback Whale',             9),
    s('Blue_whale',               'beauty',     'Largest Animal on Earth',              9),
    s('Sperm_whale',              'portrait',   'Sperm Whale Portrait',                 7),
  ],

  octopuses: [
    s('Common_octopus',           'expression', 'Alien-Faced Octopus',                  9),
    s('Mimic_octopus',            'action',     'Shape-Shifting Mimic Octopus',         9),
    s('Giant_Pacific_octopus',    'beauty',     'Giant Pacific Octopus',                8),
  ],

  sharks: [
    s('Whale_shark',              'beauty',     'Gentle Giant Whale Shark',            10),
    s('Nurse_shark',              'wholesome',  'Resting Nurse Shark',                  8),
    s('Hammerhead_shark',         'beauty',     'Unique-Headed Hammerhead',             8),
    s('Great_white_shark',        'action',     'Great White Shark',                    8),
    s('Wobbegong',                'funny',      'Carpet-Like Wobbegong Shark',          7),
  ],

  // ── BIRDS ─────────────────────────────────────────────────────────────
  birds: [
    s('Budgerigar',               'expression', 'Colorful Budgie Face',                 9),
    s('Lovebird',                 'wholesome',  'Bonded Lovebird Pair',                 9),
    s('Cockatoo',                 'funny',      'Dramatic Crested Cockatoo',            9),
    s('Sun_conure',               'beauty',     'Vivid Orange Sun Conure',              9),
    s('Cockatiel',                'expression', 'Crested Cockatiel',                    8),
    s('African_grey_parrot',      'portrait',   'Wise African Grey Parrot',             8),
    s('Monk_parakeet',            'portrait',   'Monk Parakeet',                        7),
  ],

  penguins: [
    s('Little_penguin',           'baby',       'World\'s Smallest Penguin',           10),
    s('Emperor_penguin',          'family',     'Emperor Penguin Family Group',        10),
    s('Macaroni_penguin',         'funny',      'Yellow-Crested Macaroni Penguin',      9),
    s('Gentoo_penguin',           'action',     'Racing Gentoo Penguin',                8),
    s('African_penguin',          'wholesome',  'African Penguin Pair',                 8),
  ],

  owls: [
    s('Barn_owl',                 'beauty',     'Heart-Faced Barn Owl',                10),
    s('Snowy_owl',                'beauty',     'Pure White Snowy Owl',                10),
    s('Burrowing_owl',            'funny',      'Long-Legged Burrowing Owl',            9),
    s('Elf_owl',                  'baby',       'World\'s Smallest Owl',                9),
    s('Great_horned_owl',         'portrait',   'Great Horned Owl',                     8),
  ],

  eagles: [
    s('Harpy_eagle',              'expression', 'Terrifyingly Beautiful Harpy Eagle',  10),
    s('Bald_eagle',               'beauty',     'Iconic Bald Eagle',                    9),
    s('Philippine_eagle',         'expression', 'Crested Philippine Eagle',             9),
    s('Golden_eagle',             'beauty',     'Soaring Golden Eagle',                 8),
  ],

  flamingos: [
    s('Greater_flamingo',         'beauty',     'Pink Flamingo Flock',                 10),
    s('American_flamingo',        'beauty',     'Vivid American Flamingo',              9),
    s('Flamingo',                 'action',     'Flamingo Feeding in Water',            8),
  ],

  puffins: [
    s('Atlantic_puffin',          'expression', 'Rainbow-Beaked Atlantic Puffin',      10),
    s('Tufted_puffin',            'funny',      'Wild-Haired Tufted Puffin',            9),
    s('Horned_puffin',            'portrait',   'Horned Puffin Portrait',               8),
  ],

  toucans: [
    s('Toco_toucan',              'beauty',     'Iconic Toco Toucan',                  10),
    s('Keel-billed_toucan',       'beauty',     'Rainbow-Billed Keel Toucan',           9),
    s('Toucan',                   'portrait',   'Toucan Portrait',                      7),
  ],

  peacocks: [
    s('Indian_peafowl',           'beauty',     'Full Peacock Display',                10),
    s('Peacock',                  'beauty',     'Peacock Feather Eye Close-Up',         9),
    s('Green_peafowl',            'beauty',     'Emerald Green Peafowl',                9),
  ],

  'birds-of-paradise': [
    s('Superb_bird-of-paradise',  'beauty',     'Alien Display Dance',                 10),
    s('King_bird-of-paradise',    'beauty',     'Stunning King Bird of Paradise',      10),
    s('Bird-of-paradise',         'portrait',   'Bird of Paradise Portrait',            8),
  ],

  geese: [
    s('Gosling_(bird)',           'baby',       'Fluffy Newborn Gosling',              10),
    s('Canada_goose',             'funny',      'Determined Canada Goose',              8),
    s('Snow_goose',               'beauty',     'Snow Goose Flock',                     7),
    s('Greylag_goose',            'portrait',   'Greylag Goose',                        6),
  ],

  shoebill: [
    s('Shoebill',                 'expression', 'Prehistoric Shoebill Stare',          10),
  ],

  // ── WILD ──────────────────────────────────────────────────────────────
  foxes: [
    s('Arctic_fox',               'baby',       'White Arctic Fox Cubs',               10),
    s('Red_fox',                  'beauty',     'Gorgeous Red Fox',                     9),
    s('Gray_fox',                 'portrait',   'Gray Fox Portrait',                    7),
  ],

  'fennec-fox': [
    s('Fennec_fox',               'expression', 'Giant-Eared Fennec Fox',              10),
  ],

  wolves: [
    s('Arctic_wolf',              'beauty',     'Pure White Arctic Wolf',               9),
    s('Gray_wolf',                'beauty',     'Majestic Gray Wolf',                   9),
    s('Ethiopian_wolf',           'portrait',   'Rare Ethiopian Wolf',                  8),
  ],

  bears: [
    s('Polar_bear',               'baby',       'Polar Bear Cubs Playing',             10),
    s('Brown_bear',               'baby',       'Brown Bear Cubs',                      9),
    s('Sun_bear',                 'expression', 'Funny Sun Bear Long Tongue',           9),
    s('Spectacled_bear',          'portrait',   'Spectacled Bear',                      7),
    s('American_black_bear',      'wholesome',  'Black Bear',                           7),
  ],

  deer: [
    s('White-tailed_deer',        'baby',       'Spotted Fawn in Grass',               10),
    s('Roe_deer',                 'baby',       'Baby Roe Deer Fawn',                    9),
    s('Red_deer',                 'beauty',     'Majestic Red Stag',                     8),
    s('Reindeer',                 'portrait',   'Reindeer Portrait',                     8),
  ],

  otters: [
    s('Sea_otter',                'wholesome',  'Sea Otters Holding Hands',             10),
    s('North_American_river_otter','playful',   'Playful River Otter',                   9),
    s('Giant_otter',              'family',     'Giant Otter Family',                    9),
    s('European_otter',           'portrait',   'European Otter Portrait',               8),
  ],

  raccoons: [
    s('Raccoon',                  'funny',      'Bandit-Masked Raccoon',                 9),
  ],

  squirrels: [
    s('Red_squirrel',             'beauty',     'Vivid Red Squirrel',                    9),
    s('Eastern_gray_squirrel',    'funny',      'Cheeky Gray Squirrel',                  8),
    s('Fox_squirrel',             'portrait',   'Fox Squirrel Portrait',                 7),
    s('Douglas_squirrel',         'portrait',   'Douglas Squirrel',                      7),
  ],

  servals: [
    s('Serval',                   'beauty',     'Striking Spotted Serval',              10),
  ],

  // ── EXOTIC ────────────────────────────────────────────────────────────
  capybaras: [
    s('Capybara',                 'funny',      'Chill Capybara Emperor',               10),
  ],

  sloths: [
    s('Three-toed_sloth',         'baby',       'Baby Sloth Clinging to Branch',        10),
    s('Two-toed_sloth',           'wholesome',  'Peaceful Two-Toed Sloth',               8),
  ],

  koalas: [
    s('Koala',                    'wholesome',  'Koala Hugging Tree with Joey',          10),
  ],

  pandas: [
    s('Giant_panda',              'funny',      'Panda Rolling and Eating Bamboo',      10),
  ],

  'red-pandas': [
    s('Red_panda',                'beauty',     'Stunning Red Panda on Branch',         10),
  ],

  meerkats: [
    s('Meerkat',                  'funny',      'Sentinel Meerkat Standing Watch',      10),
  ],

  alpacas: [
    s('Alpaca',                   'funny',      'Curious Alpaca Close-Up',               9),
  ],

  quokkas: [
    s('Quokka',                   'wholesome',  'Happiest Animal on Earth — Quokka',    10),
  ],

  'sugar-gliders': [
    s('Sugar_glider',             'baby',       'Tiny Sugar Glider',                     9),
  ],

  lemurs: [
    s('Ring-tailed_lemur',        'funny',      'Striped-Tail Ring-Tailed Lemur',        9),
    s('Indri',                    'portrait',   'Indri Lemur',                           7),
    s('Lemur',                    'portrait',   'Lemur Portrait',                        7),
  ],

  kinkajous: [
    s('Kinkajou',                 'portrait',   'Nocturnal Kinkajou',                    7),
  ],

  'tree-kangaroos': [
    s("Goodfellow's_tree_kangaroo",'portrait',  "Goodfellow's Tree Kangaroo",            8),
    s('Tree_kangaroo',            'portrait',   'Tree Kangaroo',                         7),
  ],

  // ── REPTILES ──────────────────────────────────────────────────────────
  turtles: [
    s('Sea_turtle',               'beauty',     'Sea Turtle Gliding Underwater',         9),
    s('Galapagos_tortoise',       'portrait',   'Ancient Galápagos Tortoise',            8),
    s('Painted_turtle',           'beauty',     'Colorful Painted Turtle Shell',         7),
    s('Red-eared_slider',         'portrait',   'Red-Eared Slider',                      7),
  ],

  lizards: [
    s('Crested_gecko',            'expression', 'Smiling Crested Gecko',                 9),
    s('Leopard_gecko',            'expression', 'Grinning Leopard Gecko',                9),
    s('Blue-tongued_skink',       'funny',      'Blue Tongue Shock Display',             8),
  ],

  chameleons: [
    s('Panther_chameleon',        'beauty',     'Vivid Rainbow Panther Chameleon',      10),
    s('Veiled_chameleon',         'expression', 'Independent-Eye Veiled Chameleon',      9),
    s('Chameleon',                'action',     'Chameleon Changing Color',              8),
  ],

  snakes: [
    s('Emerald_tree_boa',         'beauty',     'Vivid Green Emerald Tree Boa',          9),
    s('Rainbow_boa',              'beauty',     'Iridescent Rainbow Boa',                9),
    s('Ball_python',              'wholesome',  'Curled Ball Python',                    8),
    s('Corn_snake',               'portrait',   'Colorful Corn Snake',                   7),
  ],

  // ── AMPHIBIANS ────────────────────────────────────────────────────────
  axolotls: [
    s('Axolotl',                  'expression', 'Perpetually Smiling Axolotl',          10),
  ],

  frogs: [
    s('Red-eyed_tree_frog',       'expression', 'Iconic Red-Eyed Tree Frog',            10),
    s('Poison_dart_frog',         'beauty',     'Vivid Poison Dart Frog',               10),
    s('Strawberry_poison-dart_frog','beauty',   'Strawberry Poison Dart Frog',           9),
    s('Glass_frog',               'funny',      'See-Through Glass Frog',                9),
    s('African_bullfrog',         'portrait',   'African Bullfrog',                      7),
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
  ],

  // ── LEGENDARY ─────────────────────────────────────────────────────────
  kakapo: [
    s('Kakapo',                   'expression', 'Legendary Kakapo Parrot',              10),
  ],

  'saiga-antelope': [
    s('Saiga_antelope',           'expression', 'Prehistoric Saiga Nose',               10),
  ],

  'aye-aye': [
    s('Aye-aye',                  'expression', 'Mysterious Big-Eyed Aye-Aye',          9),
  ],

  okapi: [
    s('Okapi',                    'beauty',     'Elusive Okapi — Forest Giraffe',        9),
  ],

  pangolin: [
    s('Pangolin',                 'expression', 'Armored Pangolin Rolled Up',           10),
    s('Sunda_pangolin',           'portrait',   'Sunda Pangolin',                        8),
    s('Chinese_pangolin',         'portrait',   'Chinese Pangolin',                      7),
  ],

  vaquita: [
    s('Vaquita',                  'portrait',   'World\'s Rarest Porpoise',               8),
  ],
};
