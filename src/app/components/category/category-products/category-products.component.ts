import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { environment } from '../../../../environments/environment';
import { Producto } from '../../../core/interfaces/app/vendedor/vendedor.interface';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { ProductCardComponent } from '../../product/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { SkeletonCardComponent } from '../../../shared/skeleton-card/skeleton-card.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, SkeletonCardComponent, BreadcrumbComponent],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.css'
})
export class CategoryProductsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firebaseGenesisService = inject(FirebaseGenesisService);

  categoryName: string | null = null;
  products: Producto[] = [];
  isLoading = true;
  breadcrumbItems: BreadcrumbItem[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryName = decodeURIComponent(String(params.get('nombre-categoria')));
      if (this.categoryName) {
        this.setupBreadcrumb();
        this.getProductsByCategory();
      }
    });
  }

  setupBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Home', url: '/' },
      { label: 'Categoria', url: '/categoria' },
      { label: this.categoryName! }
    ];
  }

  async getProductsByCategory() {
    this.isLoading = true;

    let queryConstraints: QueryConstraint[] = [];

    queryConstraints.push(where('categoria', '==', this.categoryName!));
    const result = await this.firebaseGenesisService.busquedaQuery(environment.collection.producto, queryConstraints);

    this.products = result.success && result.data ? result.data as Producto[] : [];
    /*if(result.success && result.data){

      // Restablecer QueryConstraints
      queryConstraints = [];
      
      // hacer un foreach de this.products
      this.products.forEach(element => {
        // Agregar filtro a QueryConstraints
        queryConstraints.push(where('idProducto', '==', this.categoryName!)); 
        
        const result = await this.firebaseGenesisService.busquedaQuery(environment.collection.resenia, queryConstraints);

        // continuar con la logica hasta el siguiente elemento
        
      });

    } else {
      
    }*/
    this.isLoading = false;
  }
}
