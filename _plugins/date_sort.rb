# _plugins/filters.rb
module Jekyll
  module DateFilter
    require 'date'
    def date_sort(collection)
      collection.sort_by do |el|
        Date.parse(el.data['date'], '%b %-d %Y')
      end
    end
  end
end
Liquid::Template.register_filter(Jekyll::DateFilter)