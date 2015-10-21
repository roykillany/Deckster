class CreateSubType < ActiveRecord::Migration
  def change
    create_table :sub_types do |t|
    	t.string :name, null: false

    	t.timestamps
    end
  end
end
