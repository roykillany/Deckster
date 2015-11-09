# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151109153757) do

  create_table "card_types", force: :cascade do |t|
    t.string   "name",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cards", force: :cascade do |t|
    t.integer  "deck_id"
    t.integer  "collection_id"
    t.string   "name",                                   null: false
    t.string   "mana_cost",                              null: false
    t.integer  "cmc",                                    null: false
    t.string   "text"
    t.string   "power"
    t.string   "toughness"
    t.string   "rarity",                                 null: false
    t.string   "edition"
    t.boolean  "foil",                   default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image_url",              default: "",    null: false
    t.integer  "loyalty"
    t.integer  "quantity",               default: 1,     null: false
    t.string   "image_url_file_name"
    t.string   "image_url_content_type"
    t.integer  "image_url_file_size"
    t.datetime "image_url_updated_at"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  add_index "cards", ["cmc"], name: "index_cards_on_cmc"
  add_index "cards", ["collection_id"], name: "index_cards_on_collection_id"
  add_index "cards", ["deck_id"], name: "index_cards_on_deck_id"
  add_index "cards", ["edition"], name: "index_cards_on_edition"
  add_index "cards", ["foil"], name: "index_cards_on_foil"
  add_index "cards", ["mana_cost"], name: "index_cards_on_mana_cost"
  add_index "cards", ["name"], name: "index_cards_on_name"
  add_index "cards", ["power"], name: "index_cards_on_power"
  add_index "cards", ["rarity"], name: "index_cards_on_rarity"
  add_index "cards", ["toughness"], name: "index_cards_on_toughness"

  create_table "collections", force: :cascade do |t|
    t.integer  "profile_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "colors", force: :cascade do |t|
    t.string   "name",         null: false
    t.string   "abbreviation", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
  end

  create_table "decks", force: :cascade do |t|
    t.integer  "profile_id",               null: false
    t.string   "title",                    null: false
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "cover_image_file_name"
    t.string   "cover_image_content_type"
    t.integer  "cover_image_file_size"
    t.datetime "cover_image_updated_at"
    t.string   "key_card"
  end

  add_index "decks", ["key_card"], name: "index_decks_on_key_card"
  add_index "decks", ["profile_id"], name: "index_decks_on_profile_id"

  create_table "join_card_types", force: :cascade do |t|
    t.integer  "card_type_id", null: false
    t.integer  "card_id",      null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "join_colors", force: :cascade do |t|
    t.integer  "color_id",   null: false
    t.integer  "card_id",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "join_sub_types", force: :cascade do |t|
    t.integer  "sub_type_id", null: false
    t.integer  "card_id",     null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "join_super_types", force: :cascade do |t|
    t.integer  "super_type_id", null: false
    t.integer  "card_id",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "profiles", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.text     "bio"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "profiles", ["user_id"], name: "index_profiles_on_user_id", unique: true

  create_table "sub_types", force: :cascade do |t|
    t.string   "name",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "super_types", force: :cascade do |t|
    t.string   "name",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string   "username",            null: false
    t.string   "email",               null: false
    t.string   "password_digest",     null: false
    t.string   "session_token",       null: false
    t.boolean  "searchable"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.string   "provider"
    t.string   "uid"
  end

  add_index "users", ["email", "searchable"], name: "index_users_on_email_and_searchable"
  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["provider"], name: "index_users_on_provider"
  add_index "users", ["uid"], name: "index_users_on_uid"
  add_index "users", ["username", "email"], name: "index_users_on_username_and_email"
  add_index "users", ["username", "searchable"], name: "index_users_on_username_and_searchable"
  add_index "users", ["username"], name: "index_users_on_username", unique: true

end
