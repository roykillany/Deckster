class AddColorColumnToCards < ActiveRecord::Migration
  def change
  	add_column :cards, :color, :string, array: true
  end
end
