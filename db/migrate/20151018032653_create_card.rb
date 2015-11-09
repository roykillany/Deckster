class CreateCard < ActiveRecord::Migration
  def change
    create_table :cards do |t|
    	t.integer :deck_id
    	t.integer :collection_id
    	t.string :name, null: false
    	t.string :mana_cost, null: false
    	t.integer :cmc, null: false
    	t.string :text
    	t.integer :power
    	t.integer :toughness
    	t.string :rarity, null: false
    	t.string :edition
    	t.boolean :foil, default: false

    	t.timestamps
    end

    add_index :cards, :deck_id
    add_index :cards, :collection_id
    add_index :cards, :name
    add_index :cards, :mana_cost
    add_index :cards, :cmc
    add_index :cards, :power
    add_index :cards, :toughness
    add_index :cards, :rarity
    add_index :cards, :edition
    add_index :cards, :foil
  end
end
