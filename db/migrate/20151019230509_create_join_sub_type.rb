class CreateJoinSubType < ActiveRecord::Migration
  def change
    create_table :join_sub_types do |t|
    	t.integer :sub_type_id, null: false
    	t.integer :card_id, null: false

    	t.timestamps
    end
  end
end
