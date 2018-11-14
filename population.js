const Promise = require('bluebird');
const axios = require('axios');
const fs = require('fs');


axios.get('http://api.population.io:80/1.0/population/Belarus/2017-01-01/')
.then((response) => {
console.log(`Country:\n${response.data.total_population.population}\n`);
}).catch((err) => {
console.log(`Error load data: ${err}`);
});



Promise.all([
    axios.get('http://api.population.io:80/1.0/population/2017/Canada/'),
    axios.get('http://api.population.io:80/1.0/population/2017/Germany/'),
    axios.get('http://api.population.io:80/1.0/population/2017/France/')
]).then((res) => {
    res.forEach((v) => {
        let females = 0;
        let males = 0;
        v.data.forEach((e) => {
            females+=e.females;
            males+=e.males;
        });
        console.log(`country: ${v.data[0].country}, females: ${females}, males: ${males}`);
    });
}).catch((err) => {
    console.log(`Error load data: ${err}`); 
});


let anyPromises = [];
anyPromises.push(axios.get('http://api.population.io:80/1.0/population/2014/Belarus/25/'));
anyPromises.push(axios.get('http://api.population.io:80/1.0/population/2015/Belarus/25/'));

Promise.any(anyPromises).then((res) => {
        console.log(`year: ${res.data[0].year}, country: ${res.data[0].country}, females: ${res.data[0].females}, males: ${res.data[0].males}`);
       
}).catch((err) => {
	console.log(`Error throw - ${err}`);
});



Promise.props({
	Turkey: axios.get(`http://api.population.io:80/1.0/mortality-distribution/Turkey/male/49y2m/today/`),
	Greece: axios.get(`http://api.population.io:80/1.0/mortality-distribution/Greece/male/49y2m/today/`),
}).then((result) => {
	let m1 = 0;
	let m2 = 0;

	result['Turkey'].data.mortality_distribution.forEach((v) => {
		m1 += v.mortality_percent;
	});
	result['Greece'].data.mortality_distribution.forEach((v) => {
		m2 += v.mortality_percent;

	});

	m1 <= m2 ? console.log(`Turkey`) : console.log(`Greece`);

}).catch((err) => {
	console.log(`Error throw:${err}`);
});

(async () => {

	var mapPromises = [];
	await axios.get('http://api.population.io:80/1.0/countries').then((response) => {
		let str = response.data.countries + " ";
		mapPromises = str.split(',', 5) ;
	}).catch((err) => {
		console.log(`Error load data: ${err}`);
	});

		var count = 0;

	Promise.map(mapPromises, (i) => {
		return axios.get(`http://api.population.io:80/1.0/population/${i}/2013-01-01/`)
	}).then((result) => {
		console.log('Population: ');
		result.forEach((v) => {
			console.log(mapPromises[count++] +": "+ v.data.total_population.population);
		})
	}).catch((err) => {
		console.log(`Error load berries: ${err}`);
	});

})();

