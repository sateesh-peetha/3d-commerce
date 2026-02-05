// Quick test script to verify API endpoints
const http = require('http');

// Test 1: Check status (should be installer mode)
console.log('Testing /api/status...');
http.get('http://localhost:3000/api/status', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status Response:', data);

        // Test 2: Complete setup
        console.log('\nTesting /api/setup (POST)...');
        const setupData = JSON.stringify({
            adminEmail: 'admin@test.com',
            usageContext: 'small_business'
        });

        const req = http.request('http://localhost:3000/api/setup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': setupData.length
            }
        }, (res2) => {
            let data2 = '';
            res2.on('data', chunk => data2 += chunk);
            res2.on('end', () => {
                console.log('Setup Response:', data2);

                // Test 3: Check status again (should be dashboard mode)
                console.log('\nTesting /api/status after setup...');
                http.get('http://localhost:3000/api/status', (res3) => {
                    let data3 = '';
                    res3.on('data', chunk => data3 += chunk);
                    res3.on('end', () => {
                        console.log('Status Response:', data3);
                        console.log('\n✓ All tests complete!');
                    });
                });
            });
        });

        req.write(setupData);
        req.end();
    });
}).on('error', (e) => {
    console.error('Error:', e.message);
});
