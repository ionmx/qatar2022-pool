#!/usr/bin/env ruby

require 'open-uri'
require 'json'

MATCHES_URL = "https://api.fifa.com/api/v3/calendar/matches"

uri = URI.parse(MATCHES_URL)
params = { idseason: "255711", idcompetition: "17", count: 500 }
uri.query = URI.encode_www_form( params )
json = JSON.parse(uri.open.read)
data = json.dig('Results')

def build_teams(data)
  hash = {}
  data.each do |item|
    round = item.dig('StageName', 0, 'Description')
    next if round != 'First stage'
    country_code = item.dig('Home', 'Abbreviation')
    hash[country_code] = 
      {
        code: country_code,
        name: item.dig('Home', 'ShortClubName'),
        group: item.dig('GroupName', 0, 'Description').sub('Group ', '')
      }
  end
  hash.sort_by { |_k, v| v[:code] }.to_h
end

def build_matches(data)
  game = 0
  hash = {}
  data.each do |item|
    game += 1
    round = item.dig('StageName', 0, 'Description')
    group = item.dig('GroupName', 0, 'Description')
    group = group.sub('Group ', '') if group
    next if !item.dig('Home', 'Abbreviation')

    hash["#{game}"] = 
     {
        game: game,
        fifaId: item.dig('IdMatch'),
        round: round,
        group: group, 
        date: item.dig('Date'),
        timestamp: DateTime.parse(item.dig('Date')).to_time.to_i,
        location: item.dig('Stadium', 'Name', 0, 'Description'),
        home: item.dig('Home', 'Abbreviation'),
        homeName: item.dig('Home', 'ShortClubName'),
        homeScore:  item.dig('Home', 'Score') ?  item.dig('Home', 'Score') : -1,
        away: item.dig('Away', 'Abbreviation'),
        awayName: item.dig('Away', 'ShortClubName'),
        awayScore: item.dig('Away', 'Score') ? item.dig('Away', 'Score') : -1
      }  
  end
  hash
end

result = {
  teams: build_teams(data),
  matches: build_matches(data)
}

puts JSON.pretty_generate(result)
