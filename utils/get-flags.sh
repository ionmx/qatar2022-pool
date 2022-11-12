#!/usr/bin/env ruby

require 'open-uri'
require 'json'

MATCHES_URL = "https://api.fifa.com/api/v3/calendar/matches"
FLAGS_URL = "https://cloudinary.fifa.com/api/v3/picture/flags-sq-4"

uri = URI.parse(MATCHES_URL)
params = { idseason: "255711", idcompetition: "17", count: 500 }
uri.query = URI.encode_www_form( params )
json = JSON.parse(uri.open.read)
data = json.dig('Results')

downloaded = []
count = 0
data.each do |item|
  country_code = item.dig('Home', 'Abbreviation')
  next if !country_code
  next if downloaded.include? country_code
  downloaded << country_code
  puts "Downloading #{country_code} flag"
  open("../src/assets/#{country_code}.png", 'wb') do |file|
    flag_uri = URI.parse("#{FLAGS_URL}/#{country_code}")
    file << flag_uri.open.read
    count += 1
  end
end

puts "#{count} flags downloaded"
