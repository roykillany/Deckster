class CreateJoinColor < ActiveRecord::Migration
  def change
    create_table :join_colors do |t|
    	t.integer :color_id, null: false
    	t.integer :card_id, null: false

    	t.timestamps
    end
  end
end
