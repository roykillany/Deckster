class AddLoyaltyToCard < ActiveRecord::Migration
  def change
  	add_column :cards, :loyalty, :integer
  end
end
