import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
  IonContent, IonItem, IonLabel, IonInput, IonTextarea, 
  IonDatetime, IonSelect, IonSelectOption, IonList, IonCheckbox
} from '@ionic/angular/standalone';
import { CalendarService } from '../../utils/calendar-service';
import { Event, FamilyMember } from '../../utils/models';
import { Logger } from '../../utils/logger';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
    IonContent, IonItem, IonLabel, IonInput, IonTextarea, 
    IonDatetime, IonSelect, IonSelectOption, IonList, IonCheckbox
  ]
})
export class AddEventComponent {
  calendarService = new CalendarService();
  
  event: Event = {
    title: '',
    description: '',
    start_date: new Date().toISOString(),
    end_date: '',
    priority: 'medium'
  };
  
  familyMembers: FamilyMember[] = [];
  
  loadFamilyMembers() {
    this.calendarService.getFamilyMembers()
      .then(members => {
        this.familyMembers = members;
        Logger.info(`Loaded ${members.length} family members`);
      })
      .catch(error => {
        Logger.error('Failed to load family members', error);
        alert('Could not load family members');
      });
  }
  
  saveEvent() {
    if (!this.event.title.trim()) {
      alert('Please enter an event title');
      return;
    }
    
    if (this.event.end_date && new Date(this.event.end_date) < new Date(this.event.start_date)) {
      alert('End date cannot be before start date');
      return;
    }
    
    Logger.debug('Saving event', this.event);
    
    this.calendarService.createEvent(this.event)
      .then(createdEvent => {
        Logger.info('Event created successfully', { id: createdEvent.id });
        
        alert('Event created successfully!');
        
        this.event = {
          title: '',
          description: '',
          start_date: new Date().toISOString(),
          end_date: '',
          priority: 'medium'
        };
        
        this.calendarService.notifyEventCreated(createdEvent);
      })
      .catch(error => {
        Logger.error('Failed to create event', error);
        alert('Failed to create event: ' + error.message);
      });
  }
  
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
