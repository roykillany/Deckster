class AddQuantityToCard < ActiveRecord::Migration
  def change
  	add_column :cards, :quantity, :integer, null: false, default: 1
  end
end
