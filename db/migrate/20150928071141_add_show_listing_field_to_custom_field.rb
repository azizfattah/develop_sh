class AddShowListingFieldToCustomField < ActiveRecord::Migration
  def change
    add_column :custom_fields, :show_listing_field, :boolean, default: false
  end
end
