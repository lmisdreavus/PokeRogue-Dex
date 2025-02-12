const typeColors = {
Bug:'#ADBD21',
Dark:'#735A4A',
Dragon:'#7B63E7',
Electric:'#FFC631',
Fairy:'#EF70EF',
Fighting:'#A55239',
Fire:'#F75231',
Flying:'#9CADF7',
Ghost:'#6363B5',
Grass:'#7BCE52',
Ground:'#AE7A3B',
Ice:'#5ACEE7',
Normal:'#ADA594',
Poison:'#9141CB',
Psychic:'#EF4179',
Rock:'#BDA55A',
Steel:'#81A6BE',
Water:'#399CFF',
};
const fidThreshold = [
18,
328,
1154,
1163,
1173,
1174,
1175,
];
const fidToName = [
'Bug',
'Dark',
'Dragon',
'Electric',
'Fairy',
'Fighting',
'Fire',
'Flying',
'Ghost',
'Grass',
'Ground',
'Ice',
'Normal',
'Poison',
'Psychic',
'Rock',
'Steel',
'Water',
'Overgrow',
'Chlorophyll',
'Grassy Surge',
'Thick Fat',
'Effect Spore',
'Blaze',
'Solar Power',
'Beast Boost',
'Tough Claws',
'Drought',
'Berserk',
'Torrent',
'Rain Dish',
'Sturdy',
'Mega Launcher',
'Shell Armor',
'Shield Dust',
'Run Away',
'Magician',
'Shed Skin',
'Compound Eyes',
'Tinted Lens',
'Swarm',
'Sniper',
'Adaptability',
'Keen Eye',
'Tangled Feet',
'Big Pecks',
'Sheer Force',
'No Guard',
'Guts',
'Hustle',
'Strong Jaw',
'Moxie',
'Intimidate',
'Unnerve',
'Regenerator',
'Static',
'Lightning Rod',
'Electric Surge',
'Sand Veil',
'Sand Rush',
'Poison Point',
'Rivalry',
'Flare Boost',
'Cute Charm',
'Magic Guard',
'Friend Guard',
'Analytic',
'Unaware',
'Flash Fire',
'Fur Coat',
'Competitive',
'Huge Power',
'Frisk',
'Inner Focus',
'Infiltrator',
'Triage',
'Stench',
'Dry Skin',
'Damp',
'Simple',
'Wonder Skin',
'Arena Trap',
'Sand Force',
'Pickup',
'Technician',
'Limber',
'Cloud Nine',
'Swift Swim',
'Vital Spirit',
'Anger Point',
'Defiant',
'Iron Fist',
'Justified',
'Fluffy',
'Water Absorb',
'Synchronize',
'Trace',
'Steadfast',
'Quick Feet',
'Gluttony',
'Flower Gift',
'Clear Body',
'Liquid Ooze',
'Toxic Chain',
'Rock Head',
'Flame Body',
'Oblivious',
'Own Tempo',
'Magnet Pull',
'Levitate',
'Early Bird',
'Parental Bond',
'Hydration',
'Ice Body',
'Water Bubble',
'Sticky Hold',
'Poison Touch',
'Skill Link',
'Overcoat',
'Ice Scales',
'Shadow Shield',
'Cursed Body',
'Shadow Tag',
'Weak Armor',
'Rocky Payload',
'Insomnia',
'Forewarn',
'Hyper Cutter',
'Unburden',
'Soundproof',
'Aftermath',
'Transistor',
'Harvest',
'Ripen',
'Battle Armor',
'Reckless',
'Cheek Pouch',
'Neutralizing Gas',
'Filter',
'Natural Cure',
'Serene Grace',
'Healer',
'Leaf Guard',
'Seed Sower',
'Scrappy',
'Dragons Maw',
'Water Veil',
'Multiscale',
'Illuminate',
'Prankster',
'Psychic Surge',
'Mold Breaker',
'Aerilate',
'Stamina',
'Rattled',
'Imposter',
'Anticipation',
'Protean',
'Volt Absorb',
'Download',
'Pressure',
'Orichalcum Pulse',
'Immunity',
'Snow Cloak',
'Snow Warning',
'Drizzle',
'Marvel Scale',
'Neuroforce',
'Super Luck',
'Pixilate',
'Magic Bounce',
'Plus',
'Electromorphosis',
'Sap Sipper',
'Misty Surge',
'Speed Boost',
'Comatose',
'Dark Aura',
'Beads Of Ruin',
'Telepathy',
'Iron Barbs',
'Toxic Boost',
'Toxic Debris',
'Light Metal',
'Contrary',
'Pickpocket',
'Honey Gather',
'Magma Armor',
'Desolate Land',
'Slush Rush',
'Storm Drain',
'Moody',
'Suction Cups',
'Sand Stream',
'Delta Stream',
'Sharpness',
'Wind Rider',
'Poison Heal',
'Truant',
'Stall',
'Wonder Guard',
'Punk Rock',
'Normalize',
'Heavy Metal',
'Earth Eater',
'Pure Power',
'Minds Eye',
'Minus',
'Power Spot',
'Rough Skin',
'Solid Rock',
'White Smoke',
'Well Baked Body',
'Forecast',
'Color Change',
'Refrigerate',
'Primordial Sea',
'Steely Spirit',
'Prism Armor',
'Turboblaze',
'Air Lock',
'Klutz',
'Heatproof',
'Mirror Armor',
'Vessel Of Ruin',
'Motor Drive',
'Hadron Engine',
'Slow Start',
'Bad Dreams',
'Multitype',
'Victory Star',
'Intrepid Sword',
'Opportunist',
'Supreme Overlord',
'Gorilla Tactics',
'Zen Mode',
'Mummy',
'Purifying Salt',
'Defeatist',
'Wimp Out',
'Emergency Exit',
'Illusion',
'Quick Draw',
'Sword Of Ruin',
'Teravolt',
'Grim Neigh',
'Bulletproof',
'Dauntless Shield',
'Stakeout',
'Battle Bond',
'Gale Wings',
'Flower Veil',
'Symbiosis',
'Grass Pelt',
'Stance Change',
'Aroma Veil',
'Sweet Veil',
'Gooey',
'Fairy Aura',
'Soul Heart',
'Aura Break',
'Power Construct',
'Long Reach',
'Liquid Voice',
'Battery',
'Dancer',
'Schooling',
'Merciless',
'Cud Chew',
'Corrosion',
'Queenly Majesty',
'Receiver',
'Libero',
'Water Compaction',
'Sand Spit',
'Innards Out',
'Rks System',
'Shields Down',
'Disguise',
'Dazzling',
'Steelworker',
'Full Metal Body',
'Cotton Down',
'Ball Fetch',
'Steam Engine',
'Gulp Missile',
'Propeller Tail',
'Perish Body',
'Screen Cleaner',
'Wandering Spirit',
'Tablets Of Ruin',
'Ice Face',
'Hunger Switch',
'Stalwart',
'Unseen Fist',
'Chilling Neigh',
'As One Glastrier',
'As One Spectrier',
'Lingering Aroma',
'Wind Power',
'Guard Dog',
'Mycelium Might',
'Anger Shell',
'Zero To Hero',
'Costar',
'Commander',
'Armor Tail',
'Protosynthesis',
'Quark Drive',
'Thermal Exchange',
'Good As Gold',
'Supersweet Syrup',
'Hospitality',
'Embody Aspect Teal',
'Embody Aspect Wellspring',
'Embody Aspect Hearthflame',
'Embody Aspect Cornerstone',
'Tera Shift',
'Tera Shell',
'Teraform Zero',
'Poison Puppeteer',
'Surge Surfer',
'Tangling Hair',
'Galvanize',
'Power Of Alchemy',
'Pastel Veil',
'Curious Medicine',
'Mimicry',
'Tackle',
'Growl',
'Vine Whip',
'Growth',
'Leech Seed',
'Razor Leaf',
'Poison Powder',
'Sleep Powder',
'Seed Bomb',
'Take Down',
'Sweet Scent',
'Synthesis',
'Worry Seed',
'Power Whip',
'Solar Beam',
'Petal Blizzard',
'Petal Dance',
'Scratch',
'Ember',
'Smokescreen',
'Dragon Breath',
'Fire Fang',
'Slash',
'Flamethrower',
'Scary Face',
'Fire Spin',
'Inferno',
'Flare Blitz',
'Air Slash',
'Heat Wave',
'Dragon Claw',
'Tail Whip',
'Water Gun',
'Withdraw',
'Rapid Spin',
'Bite',
'Water Pulse',
'Protect',
'Rain Dance',
'Aqua Tail',
'Shell Smash',
'Iron Defense',
'Hydro Pump',
'Wave Crash',
'Flash Cannon',
'String Shot',
'Bug Bite',
'Harden',
'Gust',
'Supersonic',
'Confusion',
'Stun Spore',
'Psybeam',
'Whirlwind',
'Safeguard',
'Bug Buzz',
'Tailwind',
'Rage Powder',
'Quiver Dance',
'Poison Sting',
'Twineedle',
'Fury Attack',
'Fury Cutter',
'Rage',
'Pursuit',
'Focus Energy',
'Venoshock',
'Assurance',
'Toxic Spikes',
'Pin Missile',
'Poison Jab',
'Agility',
'Endeavor',
'Fell Stinger',
'Sand Attack',
'Quick Attack',
'Twister',
'Feather Dance',
'Wing Attack',
'Roost',
'Aerial Ace',
'Hurricane',
'Laser Focus',
'Crunch',
'Sucker Punch',
'Super Fang',
'Double Edge',
'Swords Dance',
'Peck',
'Leer',
'Drill Peck',
'Pluck',
'Drill Run',
'Wrap',
'Glare',
'Screech',
'Acid',
'Swallow',
'Stockpile',
'Spit Up',
'Acid Spray',
'Sludge Bomb',
'Gastro Acid',
'Belch',
'Haze',
'Coil',
'Gunk Shot',
'Thunder Fang',
'Ice Fang',
'Thunder Shock',
'Sweet Kiss',
'Charm',
'Nasty Plot',
'Play Nice',
'Nuzzle',
'Thunder Wave',
'Double Team',
'Electro Ball',
'Feint',
'Spark',
'Iron Tail',
'Discharge',
'Thunderbolt',
'Light Screen',
'Thunder',
'Pika Papow',
'Zippy Zap',
'Thunder Punch',
'Defense Curl',
'Rollout',
'Bulldoze',
'Swift',
'Fury Swipes',
'Dig',
'Gyro Ball',
'Sandstorm',
'Earthquake',
'Crush Claw',
'Sand Tomb',
'Double Kick',
'Helping Hand',
'Toxic',
'Flatter',
'Earth Power',
'Superpower',
'Sludge Wave',
'Horn Attack',
'Megahorn',
'Pound',
'Sing',
'Splash',
'Copycat',
'Disarming Voice',
'Spotlight',
'Stored Power',
'Encore',
'After You',
'Life Dew',
'Metronome',
'Moonlight',
'Gravity',
'Meteor Mash',
'Follow Me',
'Cosmic Power',
'Moonblast',
'Healing Wish',
'Disable',
'Spite',
'Incinerate',
'Confuse Ray',
'Will O Wisp',
'Extrasensory',
'Imprison',
'Fire Blast',
'Echoed Voice',
'Covet',
'Round',
'Rest',
'Body Slam',
'Mimic',
'Hyper Voice',
'Play Rough',
'Absorb',
'Astonish',
'Mean Look',
'Poison Fang',
'Quick Guard',
'Air Cutter',
'Leech Life',
'Mega Drain',
'Giga Drain',
'Grassy Terrain',
'Aromatherapy',
'Spore',
'X Scissor',
'Cross Poison',
'Zen Headbutt',
'Psychic',
'Silver Wind',
'Mud Slap',
'Fissure',
'Tri Attack',
'Night Slash',
'Rototiller',
'Fake Out',
'Pay Day',
'Taunt',
'Power Gem',
'Switcheroo',
'Water Sport',
'Soak',
'Psych Up',
'Amnesia',
'Wonder Room',
'Aqua Jet',
'Me First',
'Low Kick',
'Seismic Toss',
'Swagger',
'Cross Chop',
'Thrash',
'Close Combat',
'Stomping Tantrum',
'Outrage',
'Final Gambit',
'Fling',
'Rage Fist',
'Howl',
'Flame Wheel',
'Retaliate',
'Roar',
'Reversal',
'Extreme Speed',
'Odor Sleuth',
'Hypnosis',
'Mud Shot',
'Bubble Beam',
'Belly Drum',
'Dynamic Punch',
'Circle Throw',
'Teleport',
'Kinesis',
'Reflect',
'Ally Switch',
'Psycho Cut',
'Recover',
'Psyshock',
'Role Play',
'Future Sight',
'Calm Mind',
'Revenge',
'Low Sweep',
'Knock Off',
'Vital Throw',
'Strength',
'Dual Chop',
'Bulk Up',
'Karate Chop',
'Wide Guard',
'Slam',
'Leaf Storm',
'Leaf Blade',
'Hex',
'Acid Armor',
'Surf',
'Reflect Type',
'Wring Out',
'Rock Polish',
'Rock Throw',
'Smack Down',
'Self Destruct',
'Stealth Rock',
'Rock Blast',
'Explosion',
'Stone Edge',
'Heavy Slam',
'Flame Charge',
'Stomp',
'Smart Strike',
'Curse',
'Yawn',
'Headbutt',
'Slack Off',
'Heal Pulse',
'Magnet Rise',
'Metal Sound',
'Lock On',
'Zap Cannon',
'Electric Terrain',
'Cut',
'False Swipe',
'Brave Bird',
'Double Hit',
'Uproar',
'Acupressure',
'Icy Wind',
'Ice Shard',
'Aqua Ring',
'Aurora Beam',
'Brine',
'Dive',
'Ice Beam',
'Snowscape',
'Sheer Cold',
'Signal Beam',
'Poison Gas',
'Sludge',
'Minimize',
'Memento',
'Whirlpool',
'Razor Shell',
'Icicle Spear',
'Spikes',
'Icicle Crash',
'Lick',
'Payback',
'Night Shade',
'Dark Pulse',
'Shadow Ball',
'Destiny Bond',
'Dream Eater',
'Shadow Punch',
'Perish Song',
'Bind',
'Mud Sport',
'Rock Slide',
'Nightmare',
'Metal Claw',
'Flail',
'Crabhammer',
'Guillotine',
'Hammer Arm',
'Charge',
'Eerie Impulse',
'Charge Beam',
'Mirror Coat',
'Magnetic Flux',
'Barrage',
'Bullet Seed',
'Wood Hammer',
'Bone Rush',
'Bonemerang',
'Bone Club',
'Brick Break',
'Jump Kick',
'Rolling Kick',
'Mach Punch',
'Endure',
'Blaze Kick',
'Mega Kick',
'High Jump Kick',
'Axe Kick',
'Drain Punch',
'Comet Punch',
'Vacuum Wave',
'Detect',
'Bullet Punch',
'Ice Punch',
'Fire Punch',
'Mega Punch',
'Counter',
'Focus Punch',
'Smog',
'Clear Smog',
'Horn Drill',
'Soft Boiled',
'Last Resort',
'Constrict',
'Ancient Power',
'Tickle',
'Ingrain',
'Dragon Pulse',
'Dragon Dance',
'Waterfall',
'Baton Pass',
'Power Swap',
'Guard Swap',
'Barrier',
'Recycle',
'Dazzling Gleam',
'Teeter Dance',
'Steel Wing',
'Powder Snow',
'Fake Tears',
'Lovely Kiss',
'Blizzard',
'Shock Wave',
'Giga Impact',
'Lava Plume',
'Sunny Day',
'Hyper Beam',
'Vise Grip',
'Storm Throw',
'Submission',
'Work Up',
'Raging Bull',
'Mist',
'Transform',
'Baby Doll Eyes',
'Veevee Volley',
'Bouncy Bubble',
'Muddy Water',
'Buzzy Buzz',
'Sizzly Slide',
'Conversion',
'Conversion 2',
'Magic Coat',
'Spike Cannon',
'Liquidation',
'Iron Head',
'Block',
'Snore',
'Sleep Talk',
'High Horsepower',
'Freeze Dry',
'Overheat',
'Sky Attack',
'Dragon Tail',
'Dragon Rush',
'Aura Sphere',
'Psystrike',
'Magical Leaf',
'Eruption',
'Defog',
'Struggle Bug',
'Infestation',
'Shadow Sneak',
'Sticky Web',
'Toxic Thread',
'Wish',
'Fairy Wind',
'Psycho Shift',
'Cotton Spore',
'Cotton Guard',
'Ion Deluge',
'Bounce',
'Rock Tomb',
'Tearful Look',
'Head Smash',
'Acrobatics',
'U Turn',
'Glitzy Glow',
'Morning Sun',
'Baddy Bad',
'Snarl',
'Foul Play',
'Torment',
'Quash',
'Chilly Reception',
'Psywave',
'Pain Split',
'Hidden Power',
'Twin Beam',
'Mirror Shot',
'Hyper Drill',
'Poison Tail',
'Autotomize',
'Bide',
'Guard Split',
'Power Split',
'Power Trick',
'Arm Thrust',
'Throat Chop',
'Hone Claws',
'Beat Up',
'Octazooka',
'Present',
'Comeuppance',
'Psyshield Bash',
'Sketch',
'Triple Kick',
'Heal Bell',
'Milk Drink',
'Sacred Fire',
'Weather Ball',
'Aeroblast',
'Heal Block',
'Leafage',
'Energy Ball',
'Shed Tail',
'Rock Smash',
'Thief',
'Attract',
'Draining Kiss',
'Misty Terrain',
'Mystical Fire',
'Ominous Wind',
'Force Palm',
'Mind Reader',
'Shadow Claw',
'Grudge',
'Phantom Force',
'Boomburst',
'Headlong Rush',
'Facade',
'Metal Burst',
'Wild Charge',
'Entrainment',
'Flash',
'Tail Glow',
'Water Spout',
'Noble Roar',
'Dizzy Punch',
'Feint Attack',
'Power Trip',
'Spiky Shield',
'Magic Room',
'Hail',
'Substitute',
'Trick',
'Synchronoise',
'Frost Breath',
'Ice Ball',
'Clamp',
'Fly',
'Dual Wingbeat',
'Mist Ball',
'Luster Purge',
'Simple Beam',
'Origin Pulse',
'Precipice Blades',
'Dragon Ascent',
'Doom Desire',
'Skill Swap',
'Psycho Boost',
'Raging Fury',
'Hyper Fang',
'Volt Switch',
'Venom Drench',
'Chip Away',
'Lunge',
'Aromatic Mist',
'Attack Order',
'Defend Order',
'Heal Order',
'Flower Shield',
'Strength Sap',
'Frustration',
'Return',
'Lucky Chant',
'Chatter',
'Confide',
'Mirror Move',
'Grass Knot',
'Leaf Tornado',
'Aurora Veil',
'Embargo',
'Rock Wrecker',
'Sappy Seed',
'Freezy Frost',
'Trick Room',
'Sacred Sword',
'Aqua Cutter',
'Expanding Force',
'Mystical Power',
'Roar Of Time',
'Spacial Rend',
'Magma Storm',
'Foresight',
'Body Press',
'Crush Grip',
'Shadow Force',
'Lunar Dance',
'Lunar Blessing',
'Take Heart',
'Heart Swap',
'Dark Void',
'Natural Gift',
'Seed Flare',
'Punishment',
'Judgment',
'V Create',
'Searing Shot',
'Heat Crash',
'Assist',
'Flame Burst',
'Scald',
'Psychic Terrain',
'Bubble',
'Mat Block',
'Grass Whistle',
'Crafty Shield',
'Night Daze',
'Tail Slap',
'Snatch',
'Avalanche',
'Camouflage',
'Horn Leech',
'Spider Web',
'Electroweb',
'Rock Climb',
'Gear Grind',
'Shift Gear',
'Gear Up',
'Breaking Swipe',
'Water Shuriken',
'Head Charge',
'Fire Lash',
'Fiery Dance',
'Bleakwind Storm',
'Wildbolt Storm',
'Fusion Flare',
'Blue Flare',
'Fusion Bolt',
'Bolt Strike',
'Sandsear Storm',
'Glaciate',
'Secret Sword',
'Relic Song',
'Techno Blast',
'Needle Arm',
'Powder',
'Parting Shot',
'Kings Shield',
'Topsy Turvy',
'Skull Bash',
'Parabolic Charge',
'Electrify',
'Razor Wind',
'Nature Power',
'Sparkly Swirl',
'Flying Press',
'Fairy Lock',
'Branch Poke',
'Forests Curse',
'Trick Or Treat',
'Geomancy',
'Oblivion Wing',
'Focus Blast',
'Thousand Arrows',
'Thousand Waves',
'Core Enforcer',
'Lands Wrath',
'Diamond Storm',
'Hyperspace Hole',
'Steam Eruption',
'Spirit Shackle',
'Darkest Lariat',
'Sparkling Aria',
'Beak Blast',
'Ice Hammer',
'Revelation Dance',
'Pollen Puff',
'Accelerock',
'Baneful Bunker',
'Solar Blade',
'Captivate',
'Brutal Swing',
'Trop Kick',
'Floral Healing',
'Instruct',
'First Impression',
'Shore Up',
'Purify',
'Multi Attack',
'Shell Trap',
'Zing Zap',
'Psychic Fangs',
'Anchor Shot',
'Sky Uppercut',
'Clanging Scales',
'Clangorous Soul',
'Natures Madness',
'Sunsteel Strike',
'Wake Up Slap',
'Moongeist Beam',
'Power Up Punch',
'Speed Swap',
'Photon Geyser',
'Prismatic Laser',
'Fleur Cannon',
'Spectral Thief',
'Mind Blown',
'Plasma Fists',
'Double Iron Bash',
'Drum Beating',
'Pyro Ball',
'Court Change',
'Snipe Shot',
'Stuff Cheeks',
'Jaw Lock',
'Tar Shot',
'Grav Apple',
'Apple Acid',
'Overdrive',
'Burn Up',
'Octolock',
'Teatime',
'Magic Powder',
'False Surrender',
'Spirit Break',
'Obstruct',
'Meteor Assault',
'Decorate',
'No Retreat',
'Aura Wheel',
'Bolt Beak',
'Fishious Rend',
'Dragon Darts',
'Dynamax Cannon',
'Wicked Blow',
'Jungle Healing',
'Thunder Cage',
'Dragon Energy',
'Stone Axe',
'Dire Claw',
'Barb Barrage',
'Springtide Storm',
'Flower Trick',
'Torch Song',
'Aqua Step',
'Skitter Smack',
'Silk Trap',
'Revival Blessing',
'Double Shock',
'Population Bomb',
'Tidy Up',
'Terrain Pulse',
'Salt Cure',
'Armor Cannon',
'Bitter Blade',
'Doodle',
'Spicy Extract',
'Lumina Crash',
'Gigaton Hammer',
'Triple Dive',
'Flip Turn',
'Jet Punch',
'Spin Out',
'Mortal Spin',
'Last Respects',
'Ice Spinner',
'Fillet Away',
'Order Up',
'Kowtow Cleave',
'Steel Roller',
'Glaive Rush',
'Make It Rain',
'Ruination',
'Scale Shot',
'Collision Course',
'Electro Drift',
'Hydro Steam',
'Psyblade',
'Dragon Cheer',
'Syrup Bomb',
'Matcha Gotcha',
'Ivy Cudgel',
'Electro Shot',
'Fickle Beam',
'Burning Bulwark',
'Thunderclap',
'Dragon Hammer',
'Rising Voltage',
'Mighty Cleave',
'Tachyon Cutter',
'Tera Starstorm',
'Malignant Chain',
'Shadow Bone',
'Light Of Ruin',
'Shell Side Arm',
'Strange Steam',
'Freezing Glare',
'Thunderous Kick',
'Fiery Wrath',
'Eerie Spell',
'Snap Trap',
'Chloroblast',
'Infernal Parade',
'Ceaseless Edge',
'Victory Dance',
'Bitter Malice',
'Esper Wing',
'Shelter',
'Mountain Gale',
'Triple Arrows',
'Blood Moon',
'Noxious Torque',
'Floaty Fall',
'Triple Axel',
'Heart Stamp',
'Surging Strikes',
'Combat Torque',
'Volt Tackle',
'Magical Torque',
'Trailblaze',
'Glacial Lance',
'Supercell Slam',
'Wicked Torque',
'Astral Barrage',
'Scorching Sands',
'Splishy Splash',
'Blazing Torque',
'Alluring Voice',
'Behemoth Bash',
'Behemoth Blade',
'Grassy Glide',
'Psychic Noise',
'Steel Beam',
'Happy Hour',
'Secret Power',
'Blast Burn',
'Hydro Cannon',
'Frenzy Plant',
'Draco Meteor',
'Sky Drop',
'Water Pledge',
'Fire Pledge',
'Grass Pledge',
'Meteor Beam',
'Misty Explosion',
'Burning Jealousy',
'Lash Out',
'Poltergeist',
'Corrosive Gas',
'Coaching',
'Tera Blast',
'Pounce',
'Chilling Water',
'Hard Press',
'Temper Flare',
'Upper Hand',
'Freeze Shock',
'Ice Burn',
'Hyperspace Fury',
'Eternabeam',
'1',
'2',
'3',
'4',
'5',
'6',
'7',
'8',
'9',
'1',
'2',
'3',
'4',
'5',
'6',
'7',
'8',
'9',
'10',
'Female',
'Flipped',
];
