mkdir output
mgeneratejs epcs.json -n 500 > output/epcs_data.json

//mongoimport -h localhost -p 27017 -d mango -c epcs output/epcs_data.json --drop

mongoimport --host MyAtlasCluster-shard-0/myatlascluster-shard-00-00-izhs1.gcp.mongodb.net:27017,myatlascluster-shard-00-01-izhs1.gcp.mongodb.net:27017,myatlascluster-shard-00-02-izhs1.gcp.mongodb.net:27017 --ssl --username ninja --password ninja --authenticationDatabase admin --db mango --collection epcs --file output/epcs_data.json --drop
