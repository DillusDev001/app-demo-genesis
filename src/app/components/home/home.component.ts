import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { Producto } from '../../core/interfaces/app/vendedor/vendedor.interface';
import { FirebaseGenesisService } from '../../core/services/firebase.genesis.service';
import { limit, orderBy, QueryConstraint, where } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { Categoria } from '../../core/interfaces/app/administrador/categoria.interface';
import { CategoryCardComponent } from '../category/category-card/category-card.component';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SkeletonCardComponent } from '../../shared/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, CategoryCardComponent, RouterModule, SkeletonCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataProductos: Producto[] = [];
  dataCategorias: Categoria[] = [];
  heroImageStyle!: SafeStyle;
  isLoadingCategories = true;
  isLoadingProducts = true;

  constructor(
    private firebaseGenesisService: FirebaseGenesisService,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
    const imageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ66BtRjb24iknhYH0sYqjh8dJ6I1Q_2yPLOFrXM7-_dnbOgJqJru3j3g2BEx6fBAM05YG1-uwvswV-0HHj0Gy-gPqp9LGk8JT_RgCLDYD5B-0cHzxyKFLKzDkWVC8E8XfCYwv1hJH2a9ar9ujTw65udefZbii-GX6N1GNd9WliKgEhvfUMdRt7dJAJ6jb0OlvbOpZUgfLbwQ5UNpI-wBR03PuUA0vJ-Nc29oDOZbsP7R9GBxUXjdIB2R_pd0k562V4pms72Bzx9ID';
    this.heroImageStyle = this.sanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
    
    await this.getCategorias();
    await this.getProductos();
  }

  async getProductos(){
    this.isLoadingProducts = true;
    const queryConstraints: QueryConstraint[] = [];

    //queryConstraints.push(limit(12));
    queryConstraints.push(orderBy('nombre', 'asc'));
    const result = await this.firebaseGenesisService.busquedaQuery(environment.collection.producto, queryConstraints)
    this.dataProductos = result.data as Producto[];
    this.isLoadingProducts = false;
    
  }

  async getCategorias(){
    this.isLoadingCategories = true;
    const queryConstraints: QueryConstraint[] = [];

    queryConstraints.push(limit(4));
    queryConstraints.push(orderBy('nombre', 'asc'));
    const result = await this.firebaseGenesisService.busquedaQuery(environment.collection.categoria, queryConstraints)
    this.dataCategorias = result.data as Categoria[];
    this.isLoadingCategories = false;
  }

  agregarAlCarrito(producto: Producto) {
    console.log('Producto agregado al carrito:', producto);
    // Aquí puedes implementar la lógica para agregar el producto al carrito
  }
}
