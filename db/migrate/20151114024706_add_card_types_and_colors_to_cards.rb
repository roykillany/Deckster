class AddCardTypesAndColorsToCards < ActiveRecord::Migration
  def change
  	add_column :cards, :card_types, :string, default: ""
  	add_column :cards, :colors, :string, default: ""
  end
end
