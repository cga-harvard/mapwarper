# Email settings
ActionMailer::Base.delivery_method = :sendmail
ActionMailer::Base.smtp_settings = {
  :address => "warp.worldmap.harvard.edu",
  :port => 25,
  :domain => "warp.worldmap.harvard.edu"

}

#New stuff
#ActionMailer::Base.sendmail_settings = {
#  :location       => '/usr/sbin/sendmail',
#  :arguments      => '-i -t -f support@warp.worldmap.harvard.edu'
#}
