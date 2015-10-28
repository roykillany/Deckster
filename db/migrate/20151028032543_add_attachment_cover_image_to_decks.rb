class AddAttachmentCoverImageToDecks < ActiveRecord::Migration
  def self.up
    change_table :decks do |t|
      t.attachment :cover_image
    end
  end

  def self.down
    remove_attachment :decks, :cover_image
  end
end
