import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

const USER_DATA_PATH = './puppeteer_user_data';
const HOME_URL = 'https://portal.softcomservices.com/';
const CLIENTES_URL = 'https://portal.softcomservices.com/Clientes';
const LOGIN_URL = 'https://portal.softcomservices.com/Account/Login?ReturnUrl=%2F';
const PRODUTO_DESEJADO = 'Collector';

async function portal() {
    // Launch the browser and open a new blank page.
const browser = await puppeteer.launch({ headless: false, userDataDir : USER_DATA_PATH }); // abriu o navegador
const page = await browser.newPage(); // abriu a aba

// Navigate the page to a URL.
    //await page.goto('https://portal.softcomservices.com/Account/Login?ReturnUrl=%2F', { waitUntil: 'networkidle0' }); // url da página
    await page.setViewport({width: 1080, height: 1024});
await page.goto(CLIENTES_URL, { waitUntil: 'networkidle0' })
    // Set screen size.
    const CurrentUrl = page.url();
    if (CurrentUrl.startsWith(LOGIN_URL)) {
        await page.type('#UserName', "vanderson");
  await page.type('#Password', "franquias");
  
        await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);
console.log('✅ Login Realizado! URL atual:', page.url());
    
    } else {
        console.log('✅ Já está logado! URL atual:', page.url());
    }

    // Open the search menu using the keyboard.
    

    console.log('Login realizado! URL atual:', page.url());
    const urlAtual = page.url();
    if (!urlAtual.includes('/Clientes')) {
        console.log('📍 Navegando para página de Clientes...');
        
        await page.waitForSelector('a[href="/Clientes"]', { visible: true });
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('a[href="/Clientes"]')
        ]);
        
        console.log('✅ Chegou na página de Clientes');
    } else {
        console.log('✅ Já está na página de Clientes!');
    }
console.log('entrei na page de login');
console.log('começar a raspagem')
await page.waitForSelector('table#dataTable tbody tr', { timeout: 10000 });
    
// Nome do cliente que você quer encontrar
const nomeClienteProcurado = 'MERCADINHO JB';

// Encontra e clica no botão "Detalhes" do cliente específico
const botaoClicado = await page.evaluate((nomeCliente) => {
    // Encontra todas as linhas da tabela
    const linhas = document.querySelectorAll('table#dataTable tbody tr');
    
    for (let linha of linhas) {
        // Verifica se a linha contém o nome do cliente
        const strongElement = linha.querySelector('p.m-0 strong');
        
        if (strongElement && strongElement.innerText.trim() === nomeCliente) {
            // Encontrou a linha! Agora procura o botão "Detalhes"
            const botaoDetalhes = linha.querySelector('a.btn.btn-primary.btn-sm[title="Detalhes"]');
            
            if (botaoDetalhes) {
                botaoDetalhes.click();
                return true;
            }
        }
    }
    return false;
}, nomeClienteProcurado);

if (botaoClicado) {
    console.log(`Botão "Detalhes" do cliente "${nomeClienteProcurado}" clicado com sucesso!`);
    
    // Aguarda a navegação para a página de detalhes
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('URL da página de detalhes:', page.url());
} else {
    console.log(`Cliente "${nomeClienteProcurado}" não foi encontrado ou botão não existe.`);
    } 
    console.log('🔘 Procurando botão "Novo"...');

    const botaoNovoClicado = await page.evaluate(() => {
        // Procura o botão pelo seletor exato do HTML
        const botaoNovo = document.querySelector('a.btn.btn-success.btn-icon-split.btn-sm[data-toggle="modal"][data-target^="#modal-"]');
        
        if (botaoNovo) {
            botaoNovo.click();
            return true;
        }
        return false;
    });

    if (botaoNovoClicado) {
        console.log('✅ Botão "Novo" clicado com sucesso!');
    };
    

// Aguarda alguns segundos para você ver o resultado
// Aguarda até a rede ficar ociosa
    await page.waitForNetworkIdle({ idleTime: 500 });
    
    

await browser.close();
}

portal();