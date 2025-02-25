import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosChatComponent } from './usuarios-chat.component';

describe('UsuariosChatComponent', () => {
  let component: UsuariosChatComponent;
  let fixture: ComponentFixture<UsuariosChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
