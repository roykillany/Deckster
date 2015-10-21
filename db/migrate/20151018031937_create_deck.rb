class CreateDeck < ActiveRecord::Migration
  def change
    create_table :decks do |t|
    	t.integer :profile_id, null: false
    	t.string :title, null: false
    	t.string :description

    	t.timestamps
    end

    add_index :decks, :profile_id
  end
end
