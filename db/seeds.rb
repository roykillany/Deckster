# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

SUPER_TYPES = ["Basic", "Legendary", "World", "Snow"]
CARD_TYPES = ["Planeswalker", "Tribal", "Instant", "Sorcery", "Artifact", "Land", "Enchantment", "Creature"]
COLORS = ["White", "Blue", "Black", "Red", "Green"]
COLOR_IMGS = [
	"https://s3.amazonaws.com/decksterdev/defaults/Mana_W.png",
	"https://s3.amazonaws.com/decksterdev/defaults/Mana_U+(1).png",
	"https://s3.amazonaws.com/decksterdev/defaults/Mana_B.png",
	"https://s3.amazonaws.com/decksterdev/defaults/Mana_R.png",
	"https://s3.amazonaws.com/decksterdev/defaults/Mana_G.png"
]

SUPER_TYPES.each do |type|
	SuperType.create!({name: type})
end

CARD_TYPES.each do |type|
	CardType.create!({name: type})
end

COLORS.each_with_index do |color, idx|
	abbrv = color == "Blue" ? "U" : color[0]
	Color.create!({name: color, abbreviation: abbrv, image: COLOR_IMGS[idx]})
end