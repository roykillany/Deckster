class CreateTableUser < ActiveRecord::Migration
  def change
    create_table :users do |t|
    	t.string :username, null: false
    	t.string :email, null: false
    	t.string :password_digest, null: false
    	t.string :session_token, null: false
    	t.boolean :searchable

    	t.timestamps
    end

    add_index :users, :username, unique: true
    add_index :users, :email, unique: true
    add_index :users, [:username, :email]
    add_index :users, [:username, :searchable]
    add_index :users, [:email, :searchable]
  end
end
