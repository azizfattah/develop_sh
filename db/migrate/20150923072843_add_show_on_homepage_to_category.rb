class AddShowOnHomepageToCategory < ActiveRecord::Migration
  def change
    add_column :categories, :show_on_homepage, :boolean, default: true
  end
end
