#!/usr/bin/perl -w
use strict;
use DBI;
use CGI;

my $cgi = new CGI;
my $remote_addr = $ENV{REMOTE_ADDR};
$remote_addr ||= "127.0.0.1";

my $config; my $dbh;
eval `cat ../config.pl`;
if ($@) { die "config.pl had errors: $@ ($!)\n"; }

my $match = 0;
foreach my $re (@{$$config{ip_acl}}) {
    if ($remote_addr =~ $re) {
        $match = 1;
        last;
    }
}
printOutput() if not $match;

my $acc = $cgi->param('acc') || 150;
my $min_tst = $cgi->param('min_tst') || '1970-01-01';
my $max_tst = $cgi->param('max_tst') || '2037-12-31';

my $sth = $dbh->prepare(
    "SELECT lat, lon, acc, tst
        FROM $$config{db_table}
        WHERE
            acc <= ?
        AND tst >= ?
        AND tst <= ?
        ORDER BY id ASC")
    or die "SQL Prepare failed ($DBI::err):$DBI::errstr\n";

$sth->execute($acc, $min_tst, $max_tst);
out_json();
$sth->finish();
exit 0;


sub out_json {
    print "Content-type: text/json\n\n";

    print '[';
    if (defined $sth and ($sth->rows() > 0)) {
        while (my $row = $sth->fetchrow_hashref()) {
            print '{';
            print '"lat":"'.$$row{lat}.'",';
            print '"lon":"'.$$row{lon}.'",';
            print '"acc":"'.$$row{acc}.'",';
            print '"tst":"'.$$row{tst}.'"},';
        }
    }
    print '{"lat":"0","lon":"0","acc":"0","tst":"0"}]';

    exit 0;
}
