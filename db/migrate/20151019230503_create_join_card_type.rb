class CreateJoinCardType < ActiveRecord::Migration
  def change
    create_table :join_card_types do |t|
    	t.integer :card_type_id, null: false
    	t.integer :card_id, null: false

    	t.timestamps
    end
  end
end
