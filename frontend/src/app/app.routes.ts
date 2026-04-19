import { Routes } from '@angular/router';
import { D3Test } from './components/d3-test/d3-test';
import { Cxt } from './components/cxt/cxt';

export const routes: Routes = [
    {
        path: 'cxt',
        component: Cxt
    },    
    {
        path: 'd3-test',
        component: D3Test
    }
];
