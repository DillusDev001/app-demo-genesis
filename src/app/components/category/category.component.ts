import { Component, OnInit, inject } from '@angular/core';
import { FirebaseGenesisService } from '../../core/services/firebase.genesis.service';
import { environment } from '../../../environments/environment';
import { Categoria } from '../../core/interfaces/app/administrador/categoria.interface';
import { CommonModule } from '@angular/common';
import { SkeletonCardComponent } from '../../shared/skeleton-card/skeleton-card.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { CategoryCardComponent } from './category-card/category-card.component';
import { orderBy, QueryConstraint, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, SkeletonCardComponent, BreadcrumbComponent, CategoryCardComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  private firebaseGenesisService = inject(FirebaseGenesisService);

  categories: Categoria[] = [];
  isLoading = true;
  breadcrumbItems: BreadcrumbItem[] = [];

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.getCategories();
  }

  setupBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Inicio', url: '/' },
      { label: 'Categorías' }
    ];
  }

  async getCategories() {
    this.isLoading = true;

    let queryConstraints: QueryConstraint[] = [];

    queryConstraints.push(orderBy('nombre', 'asc'));
    const result = await this.firebaseGenesisService.busquedaQuery(environment.collection.categoria, queryConstraints);

    this.categories = result.success && result.data ? result.data as Categoria[] : [];
    this.isLoading = false;
  }
}
