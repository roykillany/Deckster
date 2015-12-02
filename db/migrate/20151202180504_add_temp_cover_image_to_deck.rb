class AddTempCoverImageToDeck < ActiveRecord::Migration
  def change
  	add_column :decks, :temp_cov_img, :string
  end
end
