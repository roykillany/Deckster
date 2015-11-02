class AddKeyCardToDeck < ActiveRecord::Migration
  def change
  	add_column :decks, :key_card, :string

  	add_index :decks, :key_card
  end
end
