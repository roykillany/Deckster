class CreateSuperType < ActiveRecord::Migration
  def change
    create_table :super_types do |t|
    	t.string :name, null: false

    	t.timestamps
    end
  end
end
