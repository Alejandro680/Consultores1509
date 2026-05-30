import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotAiServiceTs } from './chatbot-ai.service.ts.js';

describe('ChatbotAiServiceTs', () => {
  let component: ChatbotAiServiceTs;
  let fixture: ComponentFixture<ChatbotAiServiceTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotAiServiceTs],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotAiServiceTs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
