class CreateCardType < ActiveRecord::Migration
  def change
    create_table :card_types do |t|
    	t.string :name, null: false

    	t.timestamps
    end
  end
end
