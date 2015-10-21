class CreateJoinSuperType < ActiveRecord::Migration
  def change
    create_table :join_super_types do |t|
    	t.integer :super_type_id, null: false
    	t.integer :card_id, null: false

    	t.timestamps
    end
  end
end
