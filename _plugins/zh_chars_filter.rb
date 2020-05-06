module Jekyll
  module ZhHansFilter
    def zh_chars(input)
      input.gsub(/\p{Han}/u, " a ")
    end
  end
end

Liquid::Template.register_filter(Jekyll::ZhHansFilter)