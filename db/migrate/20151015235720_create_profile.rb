class CreateProfile < ActiveRecord::Migration
  def change
    create_table :profiles do |t|
    	t.integer :user_id, null: false
    	t.text :bio

    	t.timestamps
    end

    add_index :profiles, :user_id, unique: true
  end
end
