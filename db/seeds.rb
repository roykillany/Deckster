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

SUPER_TYPES.each do |type|
	SuperType.create!({name: type})
end

CARD_TYPES.each do |type|
	CardType.create!({name: type})
end

COLORS.each do |color|
	abbrv = color == "Blue" ? "U" : color[0]
	Color.create!({name: color, abbreviation: abbrv})
end