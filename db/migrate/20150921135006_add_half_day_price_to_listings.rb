class AddHalfDayPriceToListings < ActiveRecord::Migration
  def change
    add_column :listings, :half_day_price_cent, :integer
  end
end
