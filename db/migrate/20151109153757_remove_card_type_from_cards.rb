class RemoveCardTypeFromCards < ActiveRecord::Migration
  def change
  	remove_column :cards, :card_type
  end
end
